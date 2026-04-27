<script setup>
import { ref, computed, onMounted } from 'vue';
import {
  ElAlert,
  ElButton,
  ElButtonGroup,
  ElCard,
  ElCheckbox,
  ElDialog,
  ElForm,
  ElFormItem,
  ElIcon,
  ElInput,
  ElInputNumber,
  ElMessage,
  ElMessageBox,
  ElOption,
  ElSelect,
  ElSwitch,
  ElTable,
  ElTableColumn,
  ElTag,
  vLoading
} from 'element-plus';
import { Delete, Edit, Download, Plus, Minus, Refresh, Key, Star, StarFilled, Document } from '@element-plus/icons-vue';
import 'element-plus/dist/index.css';

const isLoggedIn = ref(false);
const inputKey = ref('');
const submissions = ref([]);
const filterTrack = ref('');
const filterStarred = ref(false);
const adminToken = ref('');
const loading = ref(false);
const exportLoading = ref(false); // 🟢 导出加载状态

const dialogVisible = ref(false);
const editLoading = ref(false);
const editForm = ref({
  id: null,
  track_name: '',
  // 🟢 已移除 target_email
  students: [] 
});

const TRACK_OPTIONS = ['视觉循迹仿真赛道', '开关电源设计赛道', '三维建模设计赛道'];

onMounted(() => {
  const storedToken = localStorage.getItem('admin_token');
  if (storedToken) {
    adminToken.value = storedToken;
    isLoggedIn.value = true;
    fetchData(); 
  }
});

const handleLogin = async () => {
  if (!inputKey.value) return;
  loading.value = true;
  try {
    const formData = new FormData();
    formData.append('key', inputKey.value);
    const res = await fetch('/api/admin/login', { method: 'POST', body: formData });
    
    if (!res.ok) {
       const errData = await res.json();
       throw new Error(errData.detail || `Status: ${res.status}`);
    }
    
    const data = await res.json();
    if (data.status === 'success') {
      isLoggedIn.value = true;
      adminToken.value = data.token;
      localStorage.setItem('admin_token', data.token);
      ElMessage.success('登录成功');
      fetchData();
    }
  } catch (err) {
    ElMessage.error(err.message || '登录失败');
  } finally {
    loading.value = false;
  }
};

const logout = () => {
  isLoggedIn.value = false;
  inputKey.value = '';
  submissions.value = [];
  adminToken.value = '';
  localStorage.removeItem('admin_token');
  ElMessage.info('已退出登录');
};

const fetchData = async () => {
  loading.value = true;
  try {
    const res = await fetch('/api/admin/submissions', {
      method: 'GET',
      headers: { 'x-admin-token': adminToken.value }
    });
    
    if (res.status === 403) {
      logout();
      ElMessage.error('登录已过期，请重新登录');
      return;
    }
    
    if (!res.ok) throw new Error(`Status: ${res.status}`);
    
    const data = await res.json();
    submissions.value = data.map(item => ({
      ...item,
      is_graded: !!item.is_graded,
      remark: item.remark || ''
    }));
  } catch (err) {
    ElMessage.error('获取数据失败');
  } finally {
    loading.value = false;
  }
};

// 🟢 [新增] 导出 Excel 功能
const handleExportExcel = async () => {
  exportLoading.value = true;
  try {
    const res = await fetch('/api/admin/export_excel', {
      method: 'GET',
      headers: { 'x-admin-token': adminToken.value }
    });

    if (res.status === 403) {
      logout();
      ElMessage.error('登录已过期');
      return;
    }

    if (!res.ok) throw new Error('Export failed');

    // 处理文件下载
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    a.download = `比赛提交统计_${dateStr}.xlsx`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    ElMessage.success('导出成功');
  } catch (err) {
    console.error(err);
    ElMessage.error('导出失败，请重试');
  } finally {
    exportLoading.value = false;
  }
};

const handleDownload = async (row) => {
  try {
    const res = await fetch(`/api/download/${row.id}`, {
      method: 'GET',
      headers: { 'x-admin-token': adminToken.value }
    });

    if (res.status === 403) {
      logout();
      ElMessage.error('登录已过期');
      return;
    }

    if (!res.ok) throw new Error('Download failed');

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = row.original_filename || row.filename || `submission_${row.id}`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (err) {
    ElMessage.error('下载失败，请重试');
  }
};

const filteredList = computed(() => {
  return submissions.value.filter(item => {
    const matchTrack = !filterTrack.value || item.track_name === filterTrack.value;
    const matchStar = !filterStarred.value || item.is_starred;
    return matchTrack && matchStar;
  });
});

const handleToggleStar = async (row) => {
  const newState = !row.is_starred;
  row.is_starred = newState; 

  try {
    const formData = new FormData();
    formData.append('id', row.id);
    formData.append('is_starred', newState);

    const res = await fetch('/api/admin/toggle_star', {
      method: 'POST',
      headers: { 'x-admin-token': adminToken.value },
      body: formData
    });
    if (res.status === 403) { logout(); return; }
    if (!res.ok) throw new Error();
  } catch (err) {
    row.is_starred = !newState; 
    ElMessage.error('操作失败');
  }
};

const handleScoreChange = async (row) => {
  row.is_graded = true; 

  try {
    const formData = new FormData();
    formData.append('id', row.id);
    formData.append('score', row.score || 0);

    const res = await fetch('/api/admin/update_score', {
      method: 'POST',
      headers: { 'x-admin-token': adminToken.value },
      body: formData
    });

    if (res.status === 403) { logout(); return; }
    if (res.ok) {
      ElMessage.success({ message: '评分已保存', grouping: true, type: 'success' });
    }
  } catch (err) {
    ElMessage.error('评分保存失败');
  }
};

const handleToggleGraded = async (row) => {
  try {
    const formData = new FormData();
    formData.append('id', row.id);
    formData.append('is_graded', row.is_graded);

    const res = await fetch('/api/admin/toggle_graded', {
      method: 'POST',
      headers: { 'x-admin-token': adminToken.value },
      body: formData
    });

    if (res.status === 403) { logout(); return; }
    if (!res.ok) throw new Error();
  } catch (err) {
    row.is_graded = !row.is_graded; 
    ElMessage.error('状态更新失败');
  }
};

const handleRemarkChange = async (row) => {
  try {
    const formData = new FormData();
    formData.append('id', row.id);
    formData.append('remark', row.remark);

    const res = await fetch('/api/admin/update_remark', {
      method: 'POST',
      headers: { 'x-admin-token': adminToken.value },
      body: formData
    });

    if (res.status === 403) { logout(); return; }
    if (res.ok) {
      ElMessage.success({ message: '备注已保存', grouping: true, type: 'success' });
    }
  } catch (err) {
    ElMessage.error('备注保存失败');
  }
};

const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确定删除该提交记录吗？(ID: ${row.id})`, '警告',
    { confirmButtonText: '删除', cancelButtonText: '取消', type: 'warning' }
  ).then(async () => {
    try {
      const res = await fetch(`/api/admin/submission?id=${row.id}`, {
        method: 'DELETE',
        headers: { 'x-admin-token': adminToken.value }
      });
      
      if (res.status === 403) { logout(); return; }

      if (res.ok) {
        ElMessage.success('删除成功');
        fetchData();
      } else {
        throw new Error('删除失败');
      }
    } catch (err) {
      ElMessage.error('操作失败');
    }
  });
};

const openEdit = (row) => {
  const studentsData = row.students.map(s => ({
    name: s.name,
    cls: s.cls,
    id: s.student_id 
  }));

  editForm.value = {
    id: row.id,
    track_name: row.track_name,
    // 🟢 已移除 target_email
    students: JSON.parse(JSON.stringify(studentsData))
  };
  dialogVisible.value = true;
};

const maxMembers = computed(() => editForm.value.track_name === '开关电源设计赛道' ? 3 : 1);

const addMember = () => {
  if (editForm.value.students.length < maxMembers.value) {
    editForm.value.students.push({ name: '', cls: '', id: '' });
  }
};

const removeMember = (index) => {
  editForm.value.students.splice(index, 1);
};

const handleTrackChange = (val) => {
  if (val !== '开关电源设计赛道' && editForm.value.students.length > 1) {
    ElMessage.warning('已自动保留第一位成员');
    editForm.value.students = [editForm.value.students[0]];
  }
};

const saveEdit = async () => {
  if (editForm.value.students.length === 0) return ElMessage.error('至少需要一名成员');
  for (const s of editForm.value.students) {
    if (!s.name || !s.cls || !s.id) return ElMessage.error('请补全成员信息');
  }
  
  editLoading.value = true;
  try {
    const studentInfoJson = JSON.stringify(editForm.value.students);

    const formData = new FormData();
    formData.append('id', editForm.value.id);
    formData.append('track_name', editForm.value.track_name);
    formData.append('student_infos', studentInfoJson); 
    // 🟢 已移除 target_email

    const res = await fetch('/api/admin/update_submission', {
      method: 'POST',
      headers: { 'x-admin-token': adminToken.value },
      body: formData
    });

    if (res.status === 403) { logout(); return; }

    if (res.ok) {
      ElMessage.success('修改并保存成功');
      dialogVisible.value = false;
      fetchData();
    } else {
      const errData = await res.json();
      throw new Error(errData.detail || '服务器保存失败');
    }
  } catch (err) {
    ElMessage.error(err.message);
  } finally {
    editLoading.value = false;
  }
};

const getTrackTagType = (trackName) => {
  if (trackName.includes('视觉')) return 'success';
  if (trackName.includes('电源')) return 'warning';
  if (trackName.includes('建模')) return 'primary';
  return 'info';
};
</script>

<template>
  <div class="admin-wrapper">
    <div v-if="!isLoggedIn" class="login-container">
      <div class="login-card">
        <h2>🔐 管理员后台</h2>
        <div class="input-area">
          <el-input v-model="inputKey" type="password" placeholder="密钥" show-password @keyup.enter="handleLogin" size="large">
            <template #prefix><el-icon><Key /></el-icon></template>
          </el-input>
          <el-button type="primary" @click="handleLogin" :loading="loading" size="large" class="login-btn">进入系统</el-button>
        </div>
      </div>
    </div>

    <div v-else class="dashboard-container">
      <div class="top-bar">
        <div class="bar-left">
          <h2>🏆 作品提交管理</h2>
          <el-tag type="info" effect="plain" round>Admin Mode</el-tag>
        </div>
        <el-button type="danger" plain size="small" @click="logout">退出</el-button>
      </div>

      <div class="toolbar">
        <div class="filter-group">
          <el-checkbox v-model="filterStarred" label="只看收藏 (★)" border style="margin-right: 10px; background: white;" />
          <el-select v-model="filterTrack" placeholder="全部赛道" clearable style="width: 200px">
            <el-option v-for="t in TRACK_OPTIONS" :key="t" :label="t" :value="t"></el-option>
          </el-select>
          <el-button @click="fetchData" circle :icon="Refresh" class="refresh-btn" title="刷新列表"></el-button>
        </div>
        <div class="action-group">
          <el-button type="success" :icon="Document" :loading="exportLoading" @click="handleExportExcel">导出 Excel</el-button>
          <span class="stats" style="margin-left: 15px;">共 {{ filteredList.length }} 份</span>
        </div>
      </div>

      <el-card shadow="never" class="table-card">
        <el-table :data="filteredList" stripe style="width: 100%" v-loading="loading">
          
          <el-table-column label="收藏" width="60" align="center">
            <template #default="scope">
              <el-icon 
                class="star-btn" 
                :class="{ 'is-active': scope.row.is_starred }"
                @click="handleToggleStar(scope.row)"
                size="20"
              >
                <StarFilled v-if="scope.row.is_starred" />
                <Star v-else />
              </el-icon>
            </template>
          </el-table-column>

          <el-table-column prop="track_name" label="赛道" width="130" sortable>
            <template #default="scope">
              <el-tag :type="getTrackTagType(scope.row.track_name)" effect="dark" size="small">{{ scope.row.track_name }}</el-tag>
            </template>
          </el-table-column>
          
          <el-table-column label="成员详情" width="220">
            <template #default="scope">
              <div class="student-grid">
                <div v-for="(student, index) in scope.row.students" :key="index" class="student-row">
                  <span class="s-name">{{ student.name }}</span>
                  <span class="s-cls">{{ student.cls }}</span>
                  <span class="s-id">{{ student.student_id }}</span>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="评分 / 状态" width="180" align="center">
             <template #default="scope">
                <div class="score-container">
                   <el-input-number 
                     v-model="scope.row.score" 
                     :min="0" :max="100" 
                     size="small" 
                     controls-position="right"
                     @change="handleScoreChange(scope.row)"
                     style="width: 90px;"
                   />
                   
                   <el-switch
                     v-model="scope.row.is_graded"
                     inline-prompt
                     active-text="已评"
                     inactive-text="未评"
                     size="small"
                     @change="handleToggleGraded(scope.row)"
                   />
                </div>
             </template>
          </el-table-column>

          <el-table-column label="备注" min-width="300">
            <template #default="scope">
               <el-input 
                 v-model="scope.row.remark" 
                 placeholder="备注..." 
                 size="small"
                 @change="handleRemarkChange(scope.row)"
                 clearable
               />
            </template>
          </el-table-column>

          <el-table-column label="操作" width="140" fixed="right" align="center">
            <template #default="scope">
              <el-button-group>
                <el-button type="primary" size="small" :icon="Download" @click="handleDownload(scope.row)"></el-button>
                <el-button type="warning" size="small" :icon="Edit" @click="openEdit(scope.row)"></el-button>
                <el-button type="danger" size="small" :icon="Delete" @click="handleDelete(scope.row)"></el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <el-dialog v-model="dialogVisible" title="✏️ 修改提交信息" width="600px" :close-on-click-modal="false">
      <el-alert title="注意：修改将实时更新数据库" type="warning" show-icon :closable="false" style="margin-bottom: 20px;" />
      <el-form label-position="top">
        <el-form-item label="参赛赛道">
          <el-select v-model="editForm.track_name" @change="handleTrackChange" style="width: 100%">
            <el-option v-for="t in TRACK_OPTIONS" :key="t" :label="t" :value="t"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="成员信息">
          <div v-for="(student, idx) in editForm.students" :key="idx" class="edit-student-row">
            <div class="row-index">#{{ idx + 1 }}</div>
            <el-input v-model="student.name" placeholder="姓名" style="width: 120px"></el-input>
            <el-input v-model="student.cls" placeholder="班级" style="width: 120px"></el-input>
            <el-input v-model="student.id" placeholder="学号" style="flex: 1"></el-input>
            <el-button type="danger" :icon="Minus" circle size="small" @click="removeMember(idx)" 
                       :disabled="editForm.students.length === 1"></el-button>
          </div>
          <el-button type="primary" plain style="width: 100%; margin-top: 10px" @click="addMember" 
                       :disabled="editForm.students.length >= maxMembers">
            <el-icon><Plus /></el-icon> 添加成员 ({{ editForm.students.length }}/{{ maxMembers }})
          </el-button>
        </el-form-item>
        </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveEdit" :loading="editLoading">保存修改</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.admin-wrapper { min-height: 100vh; background-color: #f5f7fa; font-family: sans-serif; }
.login-container { display: flex; justify-content: center; align-items: center; height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.login-card { width: 400px; background: white; padding: 40px; border-radius: 12px; text-align: center; }
.login-btn { width: 100%; margin-top: 20px; }
.dashboard-container { max-width: 1380px; margin: 0 auto; padding: 30px 20px; }
.top-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; background: white; padding: 15px 20px; border-radius: 8px; }
.bar-left { display: flex; align-items: center; gap: 15px; }
.student-grid { display: flex; flex-direction: column; gap: 6px; }
.student-row { display: flex; align-items: center; background: #f4f4f5; padding: 4px 8px; border-radius: 4px; font-size: 13px; }
.s-name { font-weight: bold; margin-right: 8px; color: #303133; }
.s-cls { color: #909399; font-size: 12px; margin-right: 8px; }
.s-id { color: #909399; font-family: monospace; font-size: 12px; }

.edit-student-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.row-index { width: 30px; color: #909399; font-weight: bold; }
.star-btn { cursor: pointer; color: #d1d5db; transition: color 0.3s; }
.star-btn:hover { color: #f59e0b; }
.star-btn.is-active { color: #f59e0b; }
.toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
.filter-group { display: flex; align-items: center; gap: 10px; }
.action-group { display: flex; align-items: center; } /* 🟢 新增样式 */
.stats { color: #909399; font-size: 14px; }

.score-container { 
  display: flex; 
  flex-direction: row; 
  align-items: center; 
  justify-content: center; 
  gap: 8px; 
}

.table-card {
  overflow: hidden;
}

:deep(.el-card__body) {
  overflow-x: auto;
}

:deep(.el-table) {
  min-width: 1030px;
}

@media (max-width: 768px) {
  .login-container {
    min-height: 100vh;
    height: auto;
    padding: 24px 14px;
  }

  .login-card {
    width: 100%;
    max-width: 380px;
    padding: 28px 22px;
  }

  .dashboard-container {
    padding: 16px 10px 28px;
  }

  .top-bar,
  .toolbar {
    align-items: stretch;
    flex-direction: column;
    gap: 12px;
  }

  .top-bar {
    padding: 14px;
    margin-bottom: 16px;
  }

  .bar-left {
    align-items: flex-start;
    flex-direction: column;
    gap: 8px;
  }

  .bar-left h2 {
    margin: 0;
    font-size: 1.25rem;
    line-height: 1.3;
  }

  .filter-group,
  .action-group {
    align-items: stretch;
    flex-direction: column;
    width: 100%;
  }

  .filter-group :deep(.el-select),
  .filter-group :deep(.el-checkbox),
  .action-group :deep(.el-button),
  .refresh-btn {
    width: 100% !important;
  }

  .filter-group :deep(.el-checkbox) {
    margin-right: 0 !important;
  }

  .stats {
    margin-left: 0 !important;
  }

  .table-card :deep(.el-card__body) {
    padding: 0;
  }

  :deep(.el-dialog) {
    width: calc(100vw - 24px) !important;
    margin-top: 5vh !important;
  }

  .edit-student-row {
    align-items: stretch;
    flex-direction: column;
    gap: 8px;
  }

  .row-index {
    width: auto;
  }

  .edit-student-row :deep(.el-input) {
    width: 100% !important;
  }
}
</style>
