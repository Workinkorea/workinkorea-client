import { describe, it, expect } from 'vitest';
import {
  basicProfileSchema,
  contactInfoSchema,
  preferencesSchema,
  skillSchema,
  educationSchema,
  languageSchema,
  passwordChangeSchema,
  accountSettingsSchema,
} from '../profile';

describe('Profile Validation Schemas', () => {
  describe('basicProfileSchema', () => {
    it('should validate valid basic profile data', () => {
      const validData = {
        profile_image_url: 'https://example.com/image.jpg',
        location: '서울',
        introduction: '안녕하세요',
        address: '서울시 강남구',
        position_id: 1,
        career: 'YEAR_3',
        job_status: 'available',
        portfolio_url: 'https://portfolio.com',
        language_skills: [{ language_type: 'English', level: 'Advanced' }],
        name: '홍길동',
        country_id: 1,
      };

      const result = basicProfileSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should allow empty optional fields', () => {
      const minimalData = {
        location: '',
        introduction: '',
      };

      const result = basicProfileSchema.safeParse(minimalData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid URL format', () => {
      const invalidData = {
        profile_image_url: 'not-a-url',
      };

      const result = basicProfileSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject too long strings', () => {
      const tooLongData = {
        introduction: 'a'.repeat(501), // Max is 500
      };

      const result = basicProfileSchema.safeParse(tooLongData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('500글자');
      }
    });

    it('should validate career enum values', () => {
      const validCareer = { career: 'YEAR_5' };
      expect(basicProfileSchema.safeParse(validCareer).success).toBe(true);

      const invalidCareer = { career: 'INVALID_CAREER' };
      expect(basicProfileSchema.safeParse(invalidCareer).success).toBe(false);
    });
  });

  describe('contactInfoSchema', () => {
    it('should validate valid contact info', () => {
      const validData = {
        phone_number: '010-1234-5678',
        github_url: 'https://github.com/username',
        linkedin_url: 'https://www.linkedin.com/in/username',
        website_url: 'https://example.com',
      };

      const result = contactInfoSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject non-GitHub URLs for github_url', () => {
      const invalidData = {
        github_url: 'https://gitlab.com/username',
      };

      const result = contactInfoSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('GitHub');
      }
    });

    it('should reject non-LinkedIn URLs for linkedin_url', () => {
      const invalidData = {
        linkedin_url: 'https://facebook.com/username',
      };

      const result = contactInfoSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('LinkedIn');
      }
    });

    it('should allow empty strings for optional fields', () => {
      const emptyData = {
        phone_number: '',
        github_url: '',
        linkedin_url: '',
        website_url: '',
      };

      const result = contactInfoSchema.safeParse(emptyData);
      expect(result.success).toBe(true);
    });
  });

  describe('preferencesSchema', () => {
    it('should validate valid preferences', () => {
      const validData = {
        job_status: 'available',
        experience: 5,
        completedProjects: 10,
        preferredSalary: {
          min: 30000,
          max: 50000,
          currency: 'USD',
        },
      };

      const result = preferencesSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject if min salary is greater than max salary', () => {
      const invalidData = {
        job_status: 'available',
        experience: 5,
        completedProjects: 10,
        preferredSalary: {
          min: 60000,
          max: 50000,
          currency: 'USD',
        },
      };

      const result = preferencesSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('최소 희망 연봉');
      }
    });

    it('should reject negative experience', () => {
      const invalidData = {
        job_status: 'available',
        experience: -1,
        completedProjects: 10,
      };

      const result = preferencesSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject non-integer experience', () => {
      const invalidData = {
        job_status: 'available',
        experience: 5.5,
        completedProjects: 10,
      };

      const result = preferencesSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('skillSchema', () => {
    it('should validate valid skill', () => {
      const validData = {
        name: 'JavaScript',
        level: 80,
        category: 'technical',
        description: 'Frontend development',
      };

      const result = skillSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject skill level out of range', () => {
      const tooLow = { name: 'Skill', level: 0, category: 'technical' };
      expect(skillSchema.safeParse(tooLow).success).toBe(false);

      const tooHigh = { name: 'Skill', level: 101, category: 'technical' };
      expect(skillSchema.safeParse(tooHigh).success).toBe(false);
    });

    it('should reject invalid category', () => {
      const invalidData = {
        name: 'Skill',
        level: 50,
        category: 'invalid',
      };

      const result = skillSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should require skill name', () => {
      const invalidData = {
        name: '',
        level: 50,
        category: 'technical',
      };

      const result = skillSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('educationSchema', () => {
    it('should validate valid education', () => {
      const validData = {
        institution: '서울대학교',
        degree: '학사',
        field: '컴퓨터공학',
        startDate: '2020-03',
        endDate: '2024-02',
        current: false,
      };

      const result = educationSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should allow current education without end date', () => {
      const validData = {
        institution: '서울대학교',
        degree: '석사',
        field: '컴퓨터공학',
        startDate: '2024-03',
        current: true,
      };

      const result = educationSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject if start date is after end date', () => {
      const invalidData = {
        institution: '서울대학교',
        degree: '학사',
        field: '컴퓨터공학',
        startDate: '2024-03',
        endDate: '2020-02',
      };

      const result = educationSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject invalid date format', () => {
      const invalidData = {
        institution: '서울대학교',
        degree: '학사',
        field: '컴퓨터공학',
        startDate: '2020/03/01',
      };

      const result = educationSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('YYYY-MM');
      }
    });
  });

  describe('languageSchema', () => {
    it('should validate valid language', () => {
      const validData = {
        name: 'English',
        proficiency: 'advanced',
      };

      const result = languageSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid proficiency level', () => {
      const invalidData = {
        name: 'English',
        proficiency: 'expert',
      };

      const result = languageSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject too short language name', () => {
      const invalidData = {
        name: 'E',
        proficiency: 'beginner',
      };

      const result = languageSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('passwordChangeSchema', () => {
    it('should validate valid password change', () => {
      const validData = {
        currentPassword: 'OldPassword123!',
        newPassword: 'NewPassword123!',
        confirmPassword: 'NewPassword123!',
      };

      const result = passwordChangeSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject if passwords do not match', () => {
      const invalidData = {
        currentPassword: 'OldPassword123!',
        newPassword: 'NewPassword123!',
        confirmPassword: 'DifferentPassword123!',
      };

      const result = passwordChangeSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('일치하지 않습니다');
      }
    });

    it('should reject weak passwords', () => {
      const noNumber = {
        currentPassword: 'OldPassword!',
        newPassword: 'NewPassword!',
        confirmPassword: 'NewPassword!',
      };
      expect(passwordChangeSchema.safeParse(noNumber).success).toBe(false);

      const noSpecial = {
        currentPassword: 'OldPassword123',
        newPassword: 'NewPassword123',
        confirmPassword: 'NewPassword123',
      };
      expect(passwordChangeSchema.safeParse(noSpecial).success).toBe(false);

      const tooShort = {
        currentPassword: 'OldPassword123!',
        newPassword: 'New123!',
        confirmPassword: 'New123!',
      };
      expect(passwordChangeSchema.safeParse(tooShort).success).toBe(false);
    });
  });

  describe('accountSettingsSchema', () => {
    it('should validate valid account settings', () => {
      const validData = {
        notifications: {
          contactRequestNotifications: true,
          skillEndorsementNotifications: true,
          emailNotifications: true,
          pushNotifications: false,
          weeklyDigest: true,
          marketingEmails: false,
        },
        privacy: {
          profileVisibility: 'public',
          searchable: true,
          showEmail: false,
          showLocation: true,
        },
      };

      const result = accountSettingsSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid profile visibility', () => {
      const invalidData = {
        notifications: {
          contactRequestNotifications: true,
          skillEndorsementNotifications: true,
          emailNotifications: true,
          pushNotifications: false,
          weeklyDigest: true,
          marketingEmails: false,
        },
        privacy: {
          profileVisibility: 'friends-only',
          searchable: true,
          showEmail: false,
          showLocation: true,
        },
      };

      const result = accountSettingsSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});
