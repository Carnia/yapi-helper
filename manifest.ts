import { defineManifest } from '@crxjs/vite-plugin'
import packageJson from './package.json'

export default defineManifest(async (env) => {
  // console.log("defineManifesttttt", env)
  return {
    manifest_version: 3,
    name: 'get-schema-by-api',
    description: '处理api，自定义生成schema',
    version: packageJson.version,
    permissions: ['contextMenus','storage', 'activeTab', 'scripting'],
    options_page: 'index.html',
    host_permissions: ['http://*/*', 'https://*/*'],
    action: {
      default_title: 'get-schema-by-api配置页',
      // default_popup: 'index.html', // 在background.js里改写了action点击事件：点击action直接打开option页
      default_icon: {
        '32': 'icon1.png',
        '72': 'icon1.png',
        '128': 'icon1.png',
        '512': 'icon1.png',
      },
    },
    content_scripts: [
      // {
      //   matches: ['<all_urls>'],
      //   js: ['src/content-script.ts'],
      //   all_frames: true,
      // },
      {
        matches: ['*://*/project/*/interface/api/*'],
        js: ['src/content-script.ts'],
        // "css": ["styles.css"],
        // all_frames: true,
        run_at: 'document_start',
      },
    ],
    web_accessible_resources: [
      { 
        "resources": ['inject-popstate-listener.js'],
        "matches": ["<all_urls>"]
      }
    ],
    background: {
      service_worker: 'src/background.ts',
    },
  }
})
