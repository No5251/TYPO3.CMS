/*
 * This file is part of the TYPO3 CMS project.
 *
 * It is free software; you can redistribute it and/or modify it under
 * the terms of the GNU General Public License, either version 2
 * of the License, or any later version.
 *
 * For the full copyright and license information, please read the
 * LICENSE.txt file that was distributed with this source code.
 *
 * The TYPO3 project - inspiring people to share!
 */
import $ from"jquery";import AjaxRequest from"@typo3/core/ajax/ajax-request.js";import ModuleMenu from"@typo3/backend/module-menu.js";import Viewport from"@typo3/backend/viewport.js";import RegularEvent from"@typo3/core/event/regular-event.js";import{ModuleStateStorage}from"@typo3/backend/storage/module-state-storage.js";import Icons from"@typo3/backend/icons.js";var Identifiers,Classes;!function(e){e.containerSelector="#typo3-cms-workspaces-backend-toolbaritems-workspaceselectortoolbaritem",e.activeMenuItemLinkSelector=".dropdown-menu .selected",e.menuItemIconHolderSelector=".dropdown-table-icon",e.menuItemSelector=".t3js-workspace-item",e.menuItemLinkSelector=".t3js-workspaces-switchlink",e.toolbarItemSelector=".dropdown-toggle",e.workspaceModuleLinkSelector=".t3js-workspaces-modulelink"}(Identifiers||(Identifiers={})),function(e){e.workspaceBodyClass="typo3-in-workspace",e.workspacesTitleInToolbarClass="toolbar-item-name"}(Classes||(Classes={}));class WorkspacesMenu{static refreshPageTree(){document.dispatchEvent(new CustomEvent("typo3:pagetree:refresh"))}static getWorkspaceState(){const e=document.querySelector([Identifiers.containerSelector,Identifiers.activeMenuItemLinkSelector,Identifiers.menuItemLinkSelector].join(" "));if(null===e)return null;const t=parseInt(e.dataset.workspaceid||"0",10);return{id:t,title:e.innerText.trim(),inWorkspace:0!==t}}static updateTopBar(e){$("."+Classes.workspacesTitleInToolbarClass,Identifiers.containerSelector).remove(),Icons.getIcon("empty-empty",Icons.sizes.small).then(e=>{$(Identifiers.containerSelector+" "+Identifiers.menuItemSelector).each((t,o)=>{const r=o.querySelector(Identifiers.menuItemIconHolderSelector);r&&(r.innerHTML=e)})}),e.inWorkspace&&e.title&&$(Identifiers.toolbarItemSelector,Identifiers.containerSelector).append($("<span>",{class:Classes.workspacesTitleInToolbarClass}).text(e.title));const t=document.querySelector([Identifiers.containerSelector,Identifiers.activeMenuItemLinkSelector,Identifiers.menuItemIconHolderSelector].join(" "));null!==t&&Icons.getIcon("actions-check",Icons.sizes.small).then(e=>{t.innerHTML=e})}static updateBackendContext(e=null){null===e&&null===(e=WorkspacesMenu.getWorkspaceState())||(e.inWorkspace?($("body").addClass(Classes.workspaceBodyClass),e.title||(e.title=TYPO3.lang["Workspaces.workspaceTitle"])):$("body").removeClass(Classes.workspaceBodyClass),WorkspacesMenu.updateTopBar(e))}constructor(){Viewport.Topbar.Toolbar.registerEvent(()=>{this.initializeEvents(),WorkspacesMenu.updateBackendContext()}),new RegularEvent("typo3:datahandler:process",e=>{const t=e.detail.payload;"sys_workspace"===t.table&&"delete"===t.action&&!1===t.hasErrors&&Viewport.Topbar.refresh()}).bindTo(document)}performWorkspaceSwitch(e,t){$(Identifiers.activeMenuItemLinkSelector,Identifiers.containerSelector).removeClass("selected"),$(Identifiers.menuItemLinkSelector+"[data-workspaceid="+e+"]",Identifiers.containerSelector)?.closest(Identifiers.menuItemSelector)?.addClass("selected"),WorkspacesMenu.updateBackendContext({id:e,title:t,inWorkspace:0!==e})}initializeEvents(){$(Identifiers.containerSelector).on("click",Identifiers.workspaceModuleLinkSelector,e=>{e.preventDefault(),ModuleMenu.App.showModule(e.currentTarget.dataset.module)}),$(Identifiers.containerSelector).on("click",Identifiers.menuItemLinkSelector,e=>{e.preventDefault(),this.switchWorkspace(parseInt(e.currentTarget.dataset.workspaceid,10))})}switchWorkspace(e){new AjaxRequest(TYPO3.settings.ajaxUrls.workspace_switch).post({workspaceId:e,pageId:ModuleStateStorage.current("web").identifier}).then(async t=>{const o=await t.resolve();o.workspaceId||(o.workspaceId=0),this.performWorkspaceSwitch(o.workspaceId,o.title||"");const r=ModuleMenu.App.getCurrentModule();if(o.pageId){let e=TYPO3.Backend.ContentContainer.getUrl();e+=(e.includes("?")?"&":"?")+"id="+o.pageId,Viewport.ContentContainer.setUrl(e)}else r.startsWith("web_")?"web_WorkspacesWorkspaces"===r?ModuleMenu.App.showModule(r,"workspace="+e):ModuleMenu.App.reloadFrames():o.pageModule&&ModuleMenu.App.showModule(o.pageModule);WorkspacesMenu.refreshPageTree(),ModuleMenu.App.refreshMenu()})}}const workspacesMenu=new WorkspacesMenu;TYPO3.WorkspacesMenu=workspacesMenu;export default workspacesMenu;