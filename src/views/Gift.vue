<template>
  <div>
    <van-button type="primary" size="small" class="add-button" @click="openEditPopup(null)">新增礼品</van-button>
    <van-button type="primary" size="small" class="add-button" @click="openHistoryPopup()">兑换记录</van-button>
    <van-list>
      <van-cell v-for="gift in gifts" :key="gift.id" :title="gift.name" :label="`积分: ${gift.points}, 库存: ${gift.stock}`">
        <template #right-icon>
          <van-button type="default" style="margin-right: 10px;" size="small"
            @click="redeemGifts(gift.id)">兑换礼品</van-button>
          <van-button v-if="userInfo?.role === '超级管理员'" type="default" style="margin-right: 10px;" size="small"
            @click="openEditPopup(gift)">编辑</van-button>
          <van-button v-if="userInfo?.role === '超级管理员'" type="danger" size="small"
            @click="deleteGiftId(gift.id)">删除</van-button>
        </template>
      </van-cell>
    </van-list>

    <van-popup v-model:show="isEditPopupVisible" position="bottom" :style="{ height: '50%' }">
      <van-form @submit="saveGift">
        <van-field v-model="editGift.name" label="礼品名称" placeholder="请输入礼品名称" required />
        <van-field v-model.number="editGift.points" label="所需积分" placeholder="请输入所需积分" required type="number" />
        <van-field v-model.number="editGift.stock" label="库存" placeholder="请输入库存" required type="number" />
        <div style="padding: 16px;">
          <van-button round block type="primary" native-type="submit">保存</van-button>
        </div>
      </van-form>
    </van-popup>
    <van-popup v-model:show="isHistoryPopupVisible" position="bottom" :style="{ height: '80%' }">
      <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多兑换礼品记录了" @load="onLoad">
        <van-cell v-for="item in tableData" :key="item.id" :title="item.name" :label="formatDate(item.createdAt)"
          :value="`- ${item.pointsUsed}积分`">
          <template #value>
            <span :style="{ color: 'red' }">{{ `-${item.pointsUsed}积分` }}</span>
          </template>
        </van-cell>
      </van-list>
    </van-popup>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { showDialog, showToast } from 'vant';
import { getAllGifts, createGift, updateGift, deleteGift, GiftResponse, redeemGift, getGiftRecords } from '@/api/gift';
import { formatDate } from '@/utils/time'
const gifts = ref<GiftResponse[]>([]);
const isEditPopupVisible = ref(false);
const isHistoryPopupVisible = ref(false);
const loading = ref(false);
const finished = ref(false);
const tableData = ref<GiftResponse[]>([]);
const params = ref({
  page: 1,
  pageSize: 10,
})
const editGift = ref<GiftResponse>({
  id: 0,
  name: '',
  points: 0,
  stock: 0,
  createdAt: '',
});
const userInfo = ref(JSON.parse(localStorage.getItem('userInfo') || '{}'))

async function onLoad() {
  const { data } = await getGiftRecords(userInfo.value.id, params.value)
  tableData.value = [...tableData.value, ...data.rows]
  params.value.page++
  if (tableData.value.length >= data.total) {
    finished.value = true
  } else {
    loading.value = false
  }
  console.log("🚀 ~ onLoad ~ tableData.value:", data)
}
onMounted(async () => {
  await fetchGifts();
});

const fetchGifts = async () => {
  try {
    const { data, msg, code } = await getAllGifts();

    if (code === 200) {
      gifts.value = data;
    } else {
      showToast({ message: msg, type: 'fail' });
    }
  } catch (error) {
    showToast({ message: '加载礼品失败', type: 'fail' });
  }
};
const redeemGifts = async (id: number) => {
  try {
    const { data, msg, code } = await redeemGift(id, { userId: userInfo.value.id });
    if (code === 200) {
      showToast({ message: '兑换成功', type: 'success' });
      console.log("🚀 ~ redeemGifts ~ data:", data);
    } else {
      showToast({ message: msg, type: 'fail' });
    }
  } catch (error) {
    showToast({ message: '兑换失败', type: 'fail' });
  }
};
function openHistoryPopup() {
  isHistoryPopupVisible.value = true;
}
const openEditPopup = (gift: GiftResponse | null) => {
  if (gift) {
    editGift.value = { ...gift };
  } else {
    editGift.value = {
      id: 0,
      name: '',
      points: 0,
      stock: 0,
      createdAt: '',
    };
  }
  isEditPopupVisible.value = true;
};

const saveGift = async () => {
  try {
    if (editGift.value.id === 0) {
      // 新增礼品
      const { data, msg, code } = await createGift({
        name: editGift.value.name,
        points: editGift.value.points,
        stock: editGift.value.stock,
      });
      if (code === 200) {
        showToast({ message: '新增成功', type: 'fail' });
        gifts.value.push(data);
      } else {
        showToast({ message: msg, type: 'fail' });
      }
    } else {
      // 更新礼品
      const { data, msg, code } = await updateGift(editGift.value.id, {
        name: editGift.value.name,
        points: editGift.value.points,
        stock: editGift.value.stock,
      });
      if (code === 200) {
        showToast({ message: '更新成功', type: 'fail' });

        const index = gifts.value.findIndex((g) => g.id === editGift.value.id);
        if (index !== -1) {
          gifts.value[index] = data;
        }
      } else {
        showToast({ message: msg, type: 'fail' });

      }
    }
  } catch (error) {
    showToast({ message: '操作失败', type: 'fail' });

  } finally {
    isEditPopupVisible.value = false;
  }
};

const deleteGiftId = async (id: number) => {
  showDialog({
    title: '提示',
    message: '确定要删除吗？',
    showCancelButton: true,
  }).then(async () => {
    const { data, msg, code } = await deleteGift(id);
    if (code === 200) {
      showToast({ message: '删除成功', type: 'fail' });

      gifts.value = gifts.value.filter((gift) => gift.id !== id);
    } else {
      showToast({ message: msg, type: 'fail' });

    }
  }).catch(() => {
  })
};
</script>

<style scoped>
.add-button {
  margin: 16px;
}
</style>