import { get } from '@/utils/request.ts'
import type { ApiResponse } from '@/types/user'

// 用户资料详细信息接口
export interface UserProfileDetail {
  projectList: any[];
  summary: string;
  personalityTraits: {
    责任心: number;
    创新能力: number;
    沟通能力: number;
    团队协作: number;
    领导力: number;
  };
  industryTrends: {
    cloud: string;
    bigdata: string;
    blockchain: string;
    ai: string;
    iot: string;
  };
  personalInfo: {
    id: number;
    name: string;
    gender: string;
    phone: string;
    email: string;
    university: string;
    politicalstatus: string;
    website: string;
    avatar: string;
    major: string;
    age: number;
    applicationPosition: string;
    resumeid: number;
  };
  careerInterests: Record<string, any>;
  keywords: string[];
  educationList: any[];
  competency: Record<string, any>;
  skillGaps: Record<string, any>;
  marketValue: {
    初级: number;
    中级: number;
    高级: number;
  };
  learningPath: Record<string, any>;
  salaryExpectation: {
    初级: number;
    中级: number;
    高级: number;
  };
  recommendations: any[];
  careerGoals: Record<string, any>;
  workLifeBalance: {
    工作强度: string;
    生活平衡: string;
  };
  developmentSuggestions: string[];
  skillsList: any[];
  honorList: any[];
  networkingSuggestions: Record<string, any>;
}

/**
 * 根据用户名获取用户详细资料
 * @param username 用户名
 * @returns 用户详细资料信息
 */
export const getUserProfileByUsername = (username: string): Promise<ApiResponse<UserProfileDetail>> => {
  return get<ApiResponse<UserProfileDetail>>(`/userprofile/${username}`)
} 