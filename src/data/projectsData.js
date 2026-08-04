// src/data/projectsData.js

// 导入本地图片
import rescueRobot1 from '@/assets/projects/rescue-robot.webp'
import logisticsRobot1 from '@/assets/projects/智能物流搬运小车图片1.webp'

export const projects = [
  {
    title: '工程实践与创新能力大赛：智能救援机器人（算法开源）',
    description: '面向 2025 年工程实践与创新能力大赛智能救援赛项打造。以 NVIDIA Jetson Orin NX Super 作为核心计算平台，负责环境感知与智能决策；以 STM32 作为运动控制下位机，确保控制指令稳定、准确、实时执行，共同支持机器人在复杂环境中的自主救援任务。',
    image: rescueRobot1,
    tags: ['工程实践与创新能力大赛', 'Jetson', 'STM32', '开源'],
    url: 'https://github.com/BUCEA-EPIC/intelligent-rescue-2025'
  },
  {
    title: '工程实践与创新能力大赛：智能物流搬运机器人',
    description: '面向智能物流赛项设计的机器人系统，具备物料识别、自主运动以及精准抓取与放置能力，覆盖机械结构、嵌入式控制与系统协同等工程环节。',
    image: logisticsRobot1,
    tags: ['工程实践与创新能力大赛', '嵌入式'],
    url: ''
  }
]
