# 🔐 백엔드 수정 요청 - HttpOnly 쿠키 마이그레이션

## ⚠️ 요청 배경

**현재 문제**: 토큰을 `localStorage`에 저장 → **XSS 공격에 취약**

**해결 방안**: HttpOnly 쿠키로 전환 → JavaScript에서 토큰 접근 차단

**보안 효과**:
- ✅ XSS 공격으로부터 토큰 완전 보호
- ✅ 보안 등급 2/5 → 4/5 향상

**우선순위**: 🔴 높음 (보안 이슈)

**예상 작업 기간**: 2-3일

---

## 📋 수정 대상 (총 6개)

| 엔드포인트 | 작업 |
|-----------|------|
| `POST /auth/login` | 쿠키 설정 추가 |
| `POST /auth/company/login` | 쿠키 설정 추가 |
| `POST /auth/refresh` | 쿠키 읽기 → 쿠키 설정 |
| `POST /auth/logout` | 쿠키 삭제 추가 |
| `GET /auth/me` | 신규 엔드포인트 |
| 모든 인증 API | 미들웨어 적용 |

---

## 1️⃣ `/auth/login` 수정

### Before ❌
```python
return {
    "success": True,
    "token": access_token,  # JSON에 토큰 포함
    "user": {...}
}
```

### After ✅
```python
from fastapi import Response

@router.post("/auth/login")
async def login(data: LoginRequest, response: Response):
    # ... 인증 로직 ...

    # 쿠키 설정
    response.set_cookie(
        key="accessToken",
        value=access_token,
        httponly=True,      # XSS 차단
        secure=True,        # HTTPS 전용
        samesite="lax",     # CSRF 방어
        max_age=1800,       # 30분
        path="/",
    )

    response.set_cookie(
        key="refreshToken",
        value=refresh_token,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=604800,     # 7일
        path="/",
    )

    response.set_cookie(
        key="userType",
        value="user",
        httponly=False,     # 클라이언트 읽기 가능
        secure=True,
        samesite="lax",
        max_age=604800,
        path="/",
    )

    # JSON 응답 (토큰 제외)
    return {
        "success": True,
        "token_type": "access",
        "user": {...}
    }
```

---

## 2️⃣ `/auth/company/login` 수정

동일한 방식으로 쿠키 설정, `userType`만 `"company"`로 변경

```python
response.set_cookie(key="userType", value="company", ...)
```

---

## 3️⃣ `/auth/refresh` 수정

### Before ❌
```python
# 토큰을 어디서 읽는지 불명확
return {"accessToken": new_token}
```

### After ✅
```python
from fastapi import Cookie, HTTPException

@router.post("/auth/refresh")
async def refresh_token(
    response: Response,
    refresh_token: str = Cookie(None, alias="refreshToken")  # 쿠키에서 읽기
):
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Refresh token missing")

    # 검증 후 새 토큰 생성
    new_access_token = create_access_token(user_id)

    # 쿠키로 설정
    response.set_cookie(
        key="accessToken",
        value=new_access_token,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=1800,
        path="/",
    )

    return {"success": True, "message": "토큰 갱신 완료"}
```

---

## 4️⃣ `/auth/logout` 수정

### Before ❌
```python
return {"success": True}
```

### After ✅
```python
@router.post("/auth/logout")
async def logout(response: Response):
    # 쿠키 삭제
    response.delete_cookie("accessToken", path="/")
    response.delete_cookie("refreshToken", path="/")
    response.delete_cookie("userType", path="/")

    return {"success": True, "message": "로그아웃 성공"}
```

---

## 5️⃣ 인증 미들웨어 추가 (중요!)

**모든 인증 API에 적용할 공통 함수**

```python
from typing import Optional
from fastapi import Header, Cookie, HTTPException, Depends

def get_token_from_cookie_or_header(
    authorization: Optional[str] = Header(None),
    access_token: Optional[str] = Cookie(None, alias="accessToken")
):
    """
    쿠키 또는 헤더에서 토큰 읽기
    - 우선순위 1: Authorization 헤더
    - 우선순위 2: 쿠키
    """
    if authorization and authorization.startswith("Bearer "):
        return authorization.replace("Bearer ", "")

    if access_token:
        return access_token

    raise HTTPException(status_code=401, detail="Not authenticated")
```

### 사용 예시
```python
@router.get("/users/profile")
async def get_profile(token: str = Depends(get_token_from_cookie_or_header)):
    user = verify_token(token)
    return {"user": user}
```

**적용 대상**: 현재 `Authorization` 헤더를 사용하는 모든 API

---

## 6️⃣ `/auth/me` 엔드포인트 추가 (신규)

**용도**: Next.js 서버 컴포넌트에서 인증 확인

```python
@router.get("/auth/me")
async def get_current_user(token: str = Depends(get_token_from_cookie_or_header)):
    """현재 인증된 사용자 정보 반환"""
    user = verify_token(token)

    return {
        "user_id": str(user.id),
        "user_type": user.type,  # 'user' or 'company'
        "name": user.name,
        "email": user.email
    }
```

---

## 🧪 테스트 방법

### 1. 로그인 후 쿠키 확인
```bash
curl -X POST https://arw.byeong98.xyz/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass"}' \
  -c cookies.txt

cat cookies.txt
# ✅ accessToken, refreshToken, userType 확인
```

### 2. 쿠키로 API 호출
```bash
curl -X GET https://arw.byeong98.xyz/users/profile \
  -b cookies.txt

# ✅ 인증 성공해야 함
```

### 3. 브라우저 개발자 도구
```javascript
// Application > Cookies 확인
// ✅ accessToken (HttpOnly ✓)
// ✅ refreshToken (HttpOnly ✓)

// 콘솔에서 확인
document.cookie;
// ✅ "userType=user" 만 보임 (accessToken 안 보임)

localStorage.getItem('accessToken');
// ✅ null (더 이상 저장 안 됨)
```

---

## ✅ 체크리스트

### 백엔드 작업
- [ ] `/auth/login` 수정
- [ ] `/auth/company/login` 수정
- [ ] `/auth/refresh` 수정
- [ ] `/auth/logout` 수정
- [ ] `get_token_from_cookie_or_header()` 함수 추가
- [ ] `/auth/me` 엔드포인트 추가
- [ ] 모든 인증 API에 미들웨어 적용
- [ ] 로컬 테스트
- [ ] 스테이징 배포 및 테스트

### 환경 설정
- [ ] 개발: `secure=False` (HTTP 허용)
- [ ] 프로덕션: `secure=True` (HTTPS 전용)

---

## 💡 점진적 마이그레이션 (선택)

한 번에 변경이 부담스럽다면 1-2주간 **Dual Mode** 지원 가능:

```python
# 쿠키로 설정 (새 방식)
response.set_cookie("accessToken", access_token, httponly=True, ...)

# JSON으로도 반환 (기존 방식 - 병행)
return {
    "success": True,
    "token": access_token,  # 마이그레이션 기간 동안만
    "user": {...}
}
```

프론트엔드에서 Feature Flag로 제어 후, 안정화되면 JSON에서 토큰 제거

---

## 📞 문의

**상세 가이드**: `/docs/security/BACKEND_REQUEST.md`

**궁금한 점**: 프론트엔드 팀에게 문의

**작업 기간**:
- 백엔드 개발: 2-3일
- 프론트엔드 수정: 1일
- 테스트: 1일

---

**작성일**: 2026-01-08
**우선순위**: 🔴 높음 (보안 이슈)
