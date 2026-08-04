// src/data/teamData.js
import huaFengFang from '@/assets/team/advisor-hua.webp'
import pengCanWen from '@/assets/team/彭粲文.webp'
import caiSiYao from '@/assets/team/蔡思瑶.webp'
import wangYaJie from '@/assets/team/王雅洁.webp'
import zhaoTianYe from '@/assets/team/赵天野.jpg'
import liGuiFan from '@/assets/team/李珪璠.webp'
import wangYuXuan from '@/assets/team/王宇轩.webp'
import baiXuan from '@/assets/team/白暄.webp'
import zhangYiChuan from '@/assets/team/张易川.webp'
import wangBoYao from '@/assets/team/王博垚.webp'
import liZeJun from '@/assets/team/李泽钧.webp'

export const advisors = [
  {
    name: '化凤芳',
    role: '高级实验师',
    bio: `清华大学国家级创新创业教育实践基地特聘导师。
北京市高校优秀本科实验教学指导教师；
北京高校优秀大学生学科竞赛指导教师；
北京市高等教育学会优秀工作者。
曾获北京市高等教育教学成果一等奖2项，二等奖2项；
指导学生获国家级学科竞赛20余项，北京市级竞赛100余项。`,
    avatar: huaFengFang
  }
]

export const coreTeam = [
  { name: '彭粲文', role: '项目成员', bio: '机电学院，机器人专业，参与工作室项目开发与工程实践。', avatar: pengCanWen, avatarWidth: 900, avatarHeight: 674 },
  { name: '蔡思瑶', role: '主要负责人', bio: '测绘学院，遥感科学与技术专业', avatar: caiSiYao, avatarWidth: 800, avatarHeight: 1423 },
  { name: '赵天野', role: '项目成员', bio: '计算机相关专业，参与机器人项目开发与工程实践。', avatar: zhaoTianYe, avatarWidth: 270, avatarHeight: 270 },
  {
    name: '李珪璠',
    role: '项目成员',
    bio: '参与工作室项目开发、技术训练与工程实践。',
    avatar: liGuiFan,
    avatarWidth: 900,
    avatarHeight: 674
  },
  { name: '王宇轩', role: '项目成员', bio: '参与工作室项目开发、技术训练与团队协作。', avatar: wangYuXuan, avatarWidth: 843, avatarHeight: 900 },
  { name: '白暄', role: '项目成员', bio: '参与工作室项目开发、技术训练与工程实践。', avatar: baiXuan, avatarWidth: 800, avatarHeight: 1422 },
  { name: '张易川', role: '项目成员', bio: '参与团队项目开发与工程实践。', avatar: zhangYiChuan, avatarWidth: 506, avatarHeight: 900 },
  { name: '王雅洁', role: '项目成员', bio: '电气工程及其自动化专业（实验班），负责工作室财务报销与运营协作。', avatar: wangYaJie, avatarWidth: 800, avatarHeight: 800 },
  {
    name: '王博垚',
    role: '项目成员',
    bio: '参与工作室项目开发、技术训练与工程实践。',
    avatar: wangBoYao,
    avatarWidth: 800,
    avatarHeight: 600
  },
  {
    name: '李泽钧',
    role: '项目成员',
    bio: '参与工作室项目开发、技术训练与团队协作。',
    avatar: liZeJun,
    avatarWidth: 800,
    avatarHeight: 800
  }
]
