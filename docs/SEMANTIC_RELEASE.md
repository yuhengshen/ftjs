# Semantic Release Monorepo 配置

本项目已配置了 `semantic-release-monorepo` 来自动化版本管理和发布流程。

## 配置文件

### 根目录配置

- `.releaserc.js` - 主配置文件

### 各包配置

- `packages/antd/.releaserc.js`
- `packages/core/.releaserc.js`
- `packages/tdesign/.releaserc.js`

## 提交格式

请使用 [Conventional Commits](https://www.conventionalcommits.org/) 格式：

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### 类型

- `feat:` 新功能 (版本号 minor 增加)
- `fix:` Bug 修复 (版本号 patch 增加)
- `BREAKING CHANGE:` 重大变更 (版本号 major 增加)
- `docs:` 文档变更
- `style:` 代码格式变更
- `refactor:` 代码重构
- `test:` 测试相关
- `chore:` 构建过程或辅助工具的变动

### 作用域

可以指定包名：

- `feat(antd): 添加新组件`
- `fix(core): 修复表单验证问题`
- `feat(tdesign): 更新组件样式`

## 便利脚本

项目提供了一些便利的 npm 脚本来简化标签和发布管理：

### 发布相关

```bash
# 创建标签并触发发布
pnpm release:tag --version=1.0.0

# 预览发布内容（不实际发布）
pnpm release:preview

# 手动发布所有包
pnpm semantic-release:all
```

### 标签管理

```bash
# 查看所有标签
pnpm tag:list

# 删除标签（本地和远程）
pnpm tag:delete --tag=v1.0.0
```

### 发布单个包

```bash
cd packages/core
pnpm semantic-release
```

## 发布策略

### 基于 Git 标签发布 (当前配置)

本项目采用基于 Git 标签的发布方式，只有在创建特定格式的标签时才会触发发布：

#### 支持的标签格式

- `v*.*.*` - 标准语义化版本标签 (如 `v1.0.0`, `v1.2.3`)
- `release-*` - 自定义发布标签 (如 `release-2024.1`, `release-hotfix`)

#### 发布步骤

1. **准备发布**

   ```bash
   # 确保代码已提交并推送
   git add .
   git commit -m "feat: 添加新功能"
   git push origin main
   ```

2. **创建标签并发布**

   ```bash
   # 创建语义化版本标签
   git tag v1.0.0
   git push origin v1.0.0

   # 或者创建自定义发布标签
   git tag release-2024.1
   git push origin release-2024.1
   ```

3. **查看发布状态**
   - 在 GitHub Actions 页面查看发布进度
   - 发布完成后会自动创建 GitHub Release
   - 各个包会根据相关提交自动发布到 npm

#### 手动触发发布 (备用方案)

也可以在 GitHub Actions 页面手动触发发布：

- 支持 dry-run 模式预览发布内容
- 无需创建标签即可测试发布流程

## 环境变量

确保在 GitHub 仓库设置中配置以下 secrets：

- `GITHUB_TOKEN` - GitHub 自动提供
- `NPM_TOKEN` - NPM 发布令牌

## 版本策略

- 每个包独立版本管理
- 只有包含相关提交的包才会发布新版本
- 支持预发布版本 (beta)
- 自动生成 CHANGELOG.md
- 自动创建 GitHub Release

## 标签管理技巧

### 查看现有标签

```bash
# 查看所有标签
git tag

# 查看匹配模式的标签
git tag -l "v*"
git tag -l "release-*"
```

### 删除标签（如果需要）

```bash
# 删除本地标签
git tag -d v1.0.0

# 删除远程标签
git push origin --delete v1.0.0
```

### 基于提交创建标签

```bash
# 为特定提交创建标签
git tag v1.0.0 <commit-hash>
git push origin v1.0.0
```

## 注意事项

1. **提交规范**：确保提交消息符合 Conventional Commits 规范
2. **重大变更**：重大变更必须在提交消息中明确标识 `BREAKING CHANGE`
3. **标签命名**：建议使用语义化版本标签 `v1.0.0` 格式
4. **发布时机**：只在需要发布时创建标签，避免频繁发布
5. **依赖处理**：包之间的依赖关系会自动处理
6. **回滚机制**：如果发布有问题，可以快速删除标签阻止发布
