// src/data/projectsData.js

// 导入本地图片
import rescueRobot1 from '@/assets/projects/智能救援小车图片1.jpg'
import logisticsRobot1 from '@/assets/projects/智能物流搬运小车图片1.jpg'

export const projects = [
  {
    title: '工创大赛-智能救援机器人 (算法开源)',
    description: '专为2025年工创大赛智能救援赛项打造。以NVIDIA Jetson Orin NX Super作为核心AI大脑，负责环境感知与智能决策；以STM32作为稳定可靠的运动控制下位机，确保指令的精准实时执行，共同赋能机器人在复杂未知环境下的自主救援能力。',
    image: rescueRobot1,
    tags: ['工创大赛', 'Jetson', 'STM32', '开源'],
    url: 'https://github.com/miofelix/Intelligent-Rescue-2025'
  },
  {
    title: '工创大赛-智能物流搬运机器人',
    description: '一款专为智能物流赛项设计的机器人，具备物料识别、自主运动和精准抓取放置能力。',
    image: logisticsRobot1,
    tags: ['工创大赛', '嵌入式'],
    url: '#'
  }
]
