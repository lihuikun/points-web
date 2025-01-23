<template>
  <van-nav-bar title="朋友圈" left-arrow @click-left="$router.back()" class="nav-bar">
    <template #right>
      <van-icon name="plus" @click="addPost"/>
    </template>
  </van-nav-bar>
  <div class="friend-circle">
    <PullToRefreshList class="pullToRefreshList" ref="pullToRefreshListRef" :fetchDataFn="getTableData" :pageSize="10">
      <template v-slot:item="{ tableData }">
        <div v-for="item in tableData" :key="item.id" class="post-item">
          <div class="user-info">
            <van-image class="user-avatar" :src="item.user.avatar || avatar" round width="40px" height="40px"
              fit="cover" />
            <span class="user-name">{{ item.user.nickname }}</span>
          </div>
          <div class="post-content">
            <p>{{ item.content }}</p>
          </div>
          <van-grid class="post-images" :border="false" :column-num="3">
            <van-grid-item v-for="img in item.images" :key="img">
              <van-image :src="img" width="100%" height="100%" fit="cover" lazy-load />
            </van-grid-item>
          </van-grid>
          <div class="post-meta">
            <div class="post-time">
              <span>{{ formatDate(item.createdAt) }}</span>
              <van-icon v-if="item.userId === userInfo.id" name="delete-o" class="delete-icon"
                @click="deletePost(item.id)" />
            </div>
            <div class="post-location">
              <span>{{ item.location }}</span>
            </div>
          </div>
          <div class="post-actions">
            <van-icon name="good-job-o" class="action-icon" />
            <van-icon name="chat-o" class="action-icon" />
            <van-icon name="share-o" class="action-icon" />
          </div>
        </div>
      </template>
    </PullToRefreshList>
    <PostToMoments ref="postPopupRef" @refresh="refresh" />
  </div>
</template>

<script lang='ts' setup>
import { getPosts, deletePosts } from '@/api/posts';
import PullToRefreshList from '@/components/PullToRefreshList.vue';
import { toRefs, reactive, onMounted } from 'vue';
import type { UserInfo } from '../types';
import avatar from '@/assets/img/avatar.jpg';
import { showToast } from 'vant';

const state = reactive({
  userInfo: JSON.parse(localStorage.getItem('userInfo')) as UserInfo,
  page: 1,
  pageSize: 10,
  total: 0
});

const { userInfo, page, pageSize, total } = toRefs(state);
const pullToRefreshListRef = ref();
const postPopupRef = ref(null);
async function getTableData(page, pageSize) {
  const { data } = await getPosts({
    userId: userInfo.value.id,
    page: page,
    pageSize: pageSize
  });
  return data;
}
async function deletePost(id) {
  await deletePosts({ id, userId: userInfo.value.id })
  pullToRefreshListRef.value.deleteTableData(id);
  showToast('删除成功');
}
const formatDate = (isoDate: string) => {
  if (!isoDate) return '';
  const date = new Date(isoDate);
  return date.toISOString().replace('T', ' ').substring(0, 19); // 转换为本地时间格式
};
async function refresh() {
  pullToRefreshListRef.value.fetchData(true);
}
function addPost(){
  postPopupRef.value.openPopup();
}
</script>

<style lang='scss' scoped>
.friend-circle {
  padding: 16px;
  background-color: #f5f5f5;
  background: linear-gradient(to right, #ff7e5f, #feb47b);
  margin-top: 46px;
  min-height: 90%;
}

.post-item {
  background-color: #fff;
  border-radius: 8px;
  margin-bottom: 16px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 12px;

  .user-avatar {
    margin-right: 10px;
  }

  .user-name {
    font-size: 16px;
    font-weight: bold;
  }
}

.post-content {
  margin-bottom: 12px;
  font-size: 14px;
  color: #333;
}

.post-images {
  margin-bottom: 12px;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;

  .post-time {
    font-size: 12px;
    color: #999;

    .delete-icon {
      margin-left: 8px;
      cursor: pointer;
    }
  }

  .post-location {
    font-size: 12px;
    color: #999;
  }
}

.post-actions {
  display: flex;
  justify-content: space-around;
  padding: 8px;
  border-radius: 4px;

  .action-icon {
    font-size: 24px;
    color: #c0bdbd;
    cursor: pointer;
  }
}

.nav-bar {
  position: fixed;
  width: 100%;
}
</style>