<template>
  <!--  <div class="menu-demo">
      <a-menu mode="pop" showCollapseButton>
        <a-menu-item key="1">
          <template #icon>
            <icon-apps></icon-apps>
          </template>
          Navigation 1
        </a-menu-item>
        <a-sub-menu key="2">
          <template #icon>
            <icon-bug></icon-bug>
          </template>
          <template #title>Navigation 2</template>
          <a-menu-item key="2_0">Beijing</a-menu-item>
          <a-menu-item key="2_1">Shanghai</a-menu-item>
          <a-menu-item key="2_2">Guangzhou</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="3">
          <template #icon>
            <icon-bulb></icon-bulb>
          </template>
          <template #title>Navigation 3</template>
          <a-menu-item key="3_0">Wuhan</a-menu-item>
          <a-menu-item key="3_1">Chengdu</a-menu-item>
        </a-sub-menu>
        <a-menu-item key="4">
          <template #icon>
            <icon-safe></icon-safe>
          </template>
          Navigation 4
        </a-menu-item>
        <a-menu-item key="5">
          <template #icon>
            <icon-fire></icon-fire>
          </template>
          Navigation 5
        </a-menu-item>
      </a-menu>
    </div>-->

  <a-trigger
      :trigger="['click', 'hover']"
      clickToClose
      position="top"
      v-model:popupVisible="cornerMenuPopupVisible"
  >
    <div :class="`button-trigger ${cornerMenuPopupVisible ? 'button-trigger-active' : ''}`">
      <IconClose v-if="cornerMenuPopupVisible"/>
      <IconApps v-else/>
    </div>
    <template #content>
      <a-menu
          :style="{ marginBottom: '-4px' }"
          mode="popButton"
          :tooltipProps="{ position: 'left' }"
          showCollapseButton
          @menu-item-click="cornerMenuClick"
      >
        <a-menu-item key="1">
          <template #icon>
            <IconGithub></IconGithub>
          </template>
          Github开源主页
        </a-menu-item>
        <a-menu-item key="2">
          <template #icon>
            <IconEdit></IconEdit>
          </template>
          启用编辑功能
        </a-menu-item>
      </a-menu>
    </template>
  </a-trigger>

  <!-- 下面是整个导航部分 -->

<!-- 搜索功能 -->
  <div style="padding: 20px; flex-direction: column; display: flex;  justify-content: center;  align-items: center;">
    <div>
      <a-space direction="vertical" size="large" style="border: 1px solid var(--color-neutral-3);">
        <a-input-search :style="{width:'760px'}" placeholder="输入关键词后，点击下方的搜索网站，直接会跳转到新标签页搜索"
                        v-model="keywords"/>
      </a-space>

      <div class="search-panel">
        <div v-for="line in searchToolbox">
          <div :class="{'search-line': true, 'no-visible': line.collapsed}">
            <div class="search-line-title"><span class="nowrap">{{ line.name }}</span></div>
            <ul class="search-line-ul">
              <li class="search-line-li" v-for="site in line.sites">
                <a class="search-line-li-a cursor-pointer" @click="goToSearch(site.src)">
                  <img class="search-line-li-a-img" :src="'https://0x3.com/icon?host=' + getUrlHost(site.src)">
                  <span class="nowrap">{{ site.name }}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="search-bottom" :style="{ marginTop : searchToolboxCollapsed ? '-420px' : '0px'}">
        <a-divider :margin="10" v-if="searchToolboxCollapsed">
          <a-button shape="circle" size="mini" @click="switchSearchPanel()">
            <icon-down v-if="searchToolboxCollapsed"/>
          </a-button>
        </a-divider>
        <a-divider :margin="10" v-if="!searchToolboxCollapsed">
          <a-button shape="circle" size="mini" @click="switchSearchPanel()">
            <icon-up v-if="!searchToolboxCollapsed"/>
          </a-button>
        </a-divider>
      </div>

    </div>

    <!-- 编辑功能 -->
    <div style="">
      <a-space size="medium" :class="{'hidden':!controlEditable}">
        <span style="color: var(--color-text-2);">编辑功能：</span>
        <!--        <a-switch v-model="controlEditable"/>-->
        <a-button type="primary" @click="promptTabAt(box.length)" :class="{'hidden':!controlEditable}" size="mini">
          <template #icon>
            <icon-plus/>
          </template>
          <template #default>添加面板</template>
        </a-button>
        <a-button type="primary" @click="box = reactive(defaultBox)" :class="{'hidden':!controlEditable}" size="mini">
          <template #icon>
            <icon-refresh/>
          </template>
          <template #default>重置为默认</template>
        </a-button>
        <input type="file" ref="file" :class="{'hidden':!controlEditable}" @change="readFile()"/>
      </a-space>

      <!-- 导航本体 -->
      <draggable :list="box" handle=".category-drag-handle" :animation="100" draggable=".tab" group="tabs"
                 itemKey="index">
        <template #item="{element:tab, index: t}">
          <a-card :key="t" class="tab" :style="{ width: '760px','margin-top': '20px' }" :title="tab.name" hoverable>
            <template #extra>
              <a-space size="medium">
                <i class="iconfont icon-tuozhuai category-drag-handle grabbable" v-if="controlEditable"></i>
                <i class="iconfont cursor-pointer icon-bianji" v-if="controlEditable" @click="promptTabAt(t)"></i>
                <i class="iconfont cursor-pointer icon-chacha" v-if="controlEditable" @click="removeTabAt(t)"></i>
              </a-space>
            </template>

            <a-tabs type="card" size="medium" :editable="controlEditable" :show-add-button="controlEditable"
                    @add="handleTabAdd(t)" @delete="handleTabDelete"
                    auto-switch>
              <a-tab-pane v-for="(category, i) in tab.categories" :key="t + '_' + i" :title="category.name">
                <draggable tag="ul" :list="category.links" class="list-group" :animation="100" draggable=".link-li"
                           group="links" itemKey="i">
                  <template #item="{element :link, index: j}">
                    <li :class="{'link-li': true, 'link-li-editable':controlEditable}">
                      <div class="link-chip">
                        <img class="link-chip-image" :src="'https://0x3.com/icon?host=' + getUrlHost(link.url)">
                        <a-tooltip :content="link.name" position="tl" mini>
                          <a class="link-a" :data-url="link.url" @click.left="goToUrl(t, i, j,link.url)"
                             @click.middle="goToUrl(t, i, j,link.url)">{{ link.name }}</a>
                        </a-tooltip>
                        <div :class="{'link-chip-btn': true, 'hidden':!controlEditable}">
                          <i class="iconfont cursor-pointer icon-chacha" @click="removeLinkAt(t, i, j)"></i>
                        </div>
                      </div>
                    </li>
                  </template>
                  <template #footer>
                    <li class="link-li">
                      <div :class="{'link-chip': true,'cursor-pointer': true,'hidden':!controlEditable}"
                           @click="promptLinkAt(t, i, category.links.length)">
                        <span class="link-chip-image">➕</span>
                        <a class="link-a" style="width: auto">添加</a>
                      </div>
                    </li>
                  </template>
                </draggable>
              </a-tab-pane>
            </a-tabs>
          </a-card>
        </template>
      </draggable>

    </div>

  </div>

  <a-modal v-model:visible="form.visible" @ok="handleOk" simple>
    <a-form :model="form">
      <a-form-item field="name" label="名称">
        <a-input v-model="form.name" @pressEnter="handleOk"/>
      </a-form-item>
      <a-form-item field="url" label="地址" v-if="form.type >= 3">
        <a-input v-model="form.url" @pressEnter="handleOk"/>
      </a-form-item>
    </a-form>
  </a-modal>

</template>

<script setup>
import {RouterLink, RouterView} from 'vue-router'
import {ref, reactive, watch} from "vue";
import draggable from 'vuedraggable';
import {
  IconApps,
  IconBug,
  IconBulb,
  IconSearch,
  IconDown,
  IconUp,
  IconPlus,
  IconClose,
  IconRefresh,
  IconEdit,
  IconGithub,
} from '@arco-design/web-vue/es/icon';
import {Message} from '@arco-design/web-vue';
import defaultBox from './json/defaultBox.json'
import defaultSearchToolbox from './json/defaultSearchToolbox.json'

let cornerMenuPopupVisible = ref(false);
let controlEditable = ref(false);

let customBox = localStorage.getItem("customBox");
let box = customBox ? reactive(JSON.parse(customBox)) : reactive(defaultBox);

watch(box, (newVal, oldVal) => {
  localStorage.setItem("customBox", JSON.stringify(newVal));
})

let keywords = ref('');
const searchToolbox = reactive(defaultSearchToolbox);
let searchToolboxCollapsed = ref(true);

/**
 * 'https://0x3.com/icon?host=' + getUrlHost(link.url)
 * 'https://api.iowen.cn/favicon/' + getUrlHost(link.url) + '.png'
 * @param url
 * @returns {string}
 */
const getUrlHost = (url) => {
  let host = /^http(s)?:\/\/(.*?)\//.exec(url);
  if (host && host.length >= 2) {
    return host[2];
  }
  return '';
}

const switchSearchPanel = () => {
  searchToolboxCollapsed = !searchToolboxCollapsed
  searchToolbox.forEach((line) => {
    if (line.canBeCollapsed === undefined || line.canBeCollapsed) {
      line.collapsed = searchToolboxCollapsed;
    }
  })
}

const goToSearch = (src) => {
  window.open(src.replace('{q}', keywords.value));
}

let form = reactive({
  visible: false,
  name: '',
  url: '',
  type: 3,
  t: 0,
  i: 0,
  j: 0,
});

const goToUrl = (t, i, j, url) => {
  if (!controlEditable.value) {
    window.open(url);
  } else {
    promptLinkAt(t, i, j);
  }
}
/** 操作面板 **/
const promptTabAt = (t) => {
  form.type = 1;
  if (t < box.length) {
    form.name = box[t].name
  } else {
    form.name = ''
  }

  form.t = t
  form.visible = true;
};
const submitTab = () => {
  if (form.t < box.length) {
    box[form.t].name = form.name
  } else {
    box.push({
      name: form.name,
      categories: []
    })
  }
  form.visible = false;
};
const removeTabAt = (t) => {
  box.splice(t, 1);
};

/** 操作类别 **/
const promptCategoryAt = (t, i) => {
  form.type = 2;
  let categories = box[t].categories
  if (i < categories.length) {
    form.name = categories[i].name
  } else {
    form.name = ''
  }

  form.t = t
  form.i = i
  form.visible = true;
};
const submitCategory = () => {
  let categories = box[form.t].categories
  if (form.i < categories.length) {
    categories[form.i].name = form.name
  } else {
    categories.push({
      name: form.name,
      links: []
    })
  }
  form.visible = false;
};
const removeCategoryAt = (t, i) => {
  box[t].categories.splice(i, 1);
};

/** 操作链接 **/
const promptLinkAt = (t, i, j) => {
  form.type = 3;
  let links = box[t].categories[i].links;
  if (j < links.length) {
    form.name = links[j].name;
    form.url = links[j].url;
  } else {
    form.name = ''
    form.url = ''
  }

  form.t = t;
  form.i = i;
  form.j = j;
  form.visible = true;
};
const submitLink = () => {
  let links = box[form.t].categories[form.i].links;
  if (form.j < links.length) {
    links[form.j].name = form.name;
    links[form.j].url = form.url;
  } else {
    links.push({
      name: form.name,
      url: form.url
    })
  }
  form.visible = false;
};
const removeLinkAt = (t, i, j) => {
  box[t].categories[i].links.splice(j, 1);
};
const handleOk = () => {
  if (form.type === 3) {
    submitLink();
  } else if (form.type === 2) {
    submitCategory();
  } else if (form.type === 1) {
    submitTab();
  } else {
    Message.error({content: `未知的编辑类型`, showIcon: true});
    form.visible = false;
  }
};

const handleTabAdd = (t) => {
  promptCategoryAt(t, box[t].categories.length);
};
const handleTabDelete = (key) => {
  let arr = key.split('_')
  removeCategoryAt(arr[0], arr[1]);
};

const file = ref(null)
let bookmarkRoot = [];
const readFile = () => {
  let f = file.value.files[0];
  const reader = new FileReader();
  reader.onload = parseHtml;
  reader.onerror = (err) => console.log(err);
  reader.readAsText(f);
}

const parseHtml = (e) => {
  let parser = new DOMParser()
  let doc = parser.parseFromString(e.target.result, 'text/html')
  parse(doc.querySelector('dl').querySelector('dt').querySelector('dl').children, bookmarkRoot)


  for (let t1 of bookmarkRoot) {
    if (t1 !== undefined && t1.name.indexOf("───") <= 0) {
      const categories = []
      box.push({
        name: t1.name,
        categories: categories
      })
      if (t1.children !== undefined) {
        let y = 0;
        for (let j = 0; j < t1.children.length; j++) {
          let t2 = t1.children[j]
          if (t2 !== undefined && !t2.name.indexOf("───") <= 0) {
            const links = []
            const h = t2.children === undefined ? 4 : t2.children.length; // 高
            categories.push({
              name: t2.name,
              links: links
            })
            y += h;
            if (t2.children !== undefined) {
              for (let t3 of t2.children) {
                if (t3 !== undefined && !t3.name.indexOf("───") <= 0) {
                  links.push({
                    name: t3.name,
                    url: t3.url
                  })
                }
              }
            }
          }
        }
      }
    }
  }
};
const parse = (dtList, bookmarkList) => {
  for (let dt of dtList) {
    if (dt.tagName.toLowerCase() === 'dt') {
      let name, dtChildrenList
      for (let o of dt.children) {
        let tagName = o.tagName.toLowerCase()
        if (tagName === 'h3') {
          // 文件夹： h3 文件夹名
          name = o.innerText
        } else if (tagName === 'dl') {
          // 文件夹： dl 更多子节点
          dtChildrenList = o.children
        } else if (tagName === 'a') {
          // 链接： a 链接
          bookmarkList.push({
            name: o.innerText,
            url: o.href
          })
        }
      }
      // 文件夹继续递归
      if (name !== null && dtChildrenList != null) {
        let children = []
        bookmarkList.push({
          name: name,
          children: children
        })
        parse(dtChildrenList, children)
      }
    }
  }
};

const cornerMenuClick = (key, openKeys) => {
  if (key === '1') {
    window.open('https://github.com/huiyadanli');
  } else if (key === '2') {
    controlEditable.value = !controlEditable.value;
  } else {
    Message.error({content: `未知的菜单key`, showIcon: true});
  }
}
</script>

<style>
/*.menu-demo {
  height: 600px;
  padding: 40px;
  box-sizing: border-box;
  !*background-color: var(--color-neutral-2);*!
  float: left;
  position: fixed;
  z-index: 999;
}

.menu-demo .arco-menu {
  width: 200px;
  height: 100%;
  box-shadow: 0 0 1px rgba(0, 0, 0, 0.3);
}

.menu-demo .arco-menu :deep(.arco-menu-collapse-button) {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.menu-demo .arco-menu:not(.arco-menu-collapsed) :deep(.arco-menu-collapse-button) {
  right: 0;
  bottom: 8px;
  transform: translateX(50%);
}

.menu-demo .arco-menu:not(.arco-menu-collapsed)::before {
  content: '';
  position: absolute;
  right: 0;
  bottom: 0;
  width: 48px;
  height: 48px;
  background-color: inherit;
  border-radius: 50%;
  box-shadow: -4px 0 2px var(--color-bg-2), 0 0 1px rgba(0, 0, 0, 0.3);
  transform: translateX(50%);
}

.menu-demo .arco-menu.arco-menu-collapsed {
  width: 48px;
  height: auto;
  padding-top: 24px;
  padding-bottom: 138px;
  border-radius: 22px;
}

.menu-demo .arco-menu.arco-menu-collapsed :deep(.arco-menu-collapse-button) {
  right: 8px;
  bottom: 8px;
}*/



</style>
