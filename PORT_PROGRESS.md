# WinForms to Web Port Progress

Source of truth: `D:\Projects\CondorZentechMesManage`

- `QDHZMg\` — WinForms forms (320), grouped by module
- `tengyuesoft\` — models (`Model\<Module>`) and data access (`DataImp\<Module>`)

WinForms supplies the behavior and the data contract. The web UI is a modern web application, not a visual clone:
keep the current top-bar shell and the refined industrial theme; use responsive filter cards, sticky table headers,
totals footers, drawers or sectioned pages for editing, and inline validation.

No backend or API is connected yet. Demo pages use deterministic, clearly marked sample rows that match verified WinForms contracts; pages without fixtures show empty states.

Status: `[x]` ported and reviewed · `[~]` in progress · `[ ]` not started · `[!]` blocked

## Design and implementation rules

- [ ] Modern list shell: page header, filter card with labels above fields, auto-apply plus Apply, result summary
- [ ] Table conventions: sticky header, right-aligned numbers, monospace codes, status tags, column visibility, CSV export, totals footer, loading and empty states
- [ ] Edit conventions: side drawer for short forms, sectioned page with sticky actions for long forms, inline validation, unsaved-changes guard
- [ ] No WinForms visual clones: no toolbar icon strips, status bars, fixed-width label-left grids, or modal-for-everything
- [ ] Responsive and RTL-safe; dark mode preserved
- [ ] Empty results until the API exposes the source procedure or query; no fabricated records
- [ ] Mark a form `[x]` only after filters, columns, actions, totals, validation and state changes are reviewed against the `.cs` and `.Designer.cs`
- Demo contract: business headers come only from the WinForms form/model/procedure/import/print dataset. Fixtures may change values, never business fields; each demo page carries a “Sample data” badge.

## Phase 0 — Cleanup (current state)

- [x] Replace the KPI/alarm dashboard with a role-filtered module launcher
- [x] Remove the generic report catalogue
- [x] Remove dashboard KPI tiles, dashboard service/types and alarm store
- [~] Rebuild `/work-orders/production-report` against `FrmProductionReportList` with source columns and sample data; visual review remains
- [x] Delete line assignments and its CSV import/print workflow (no WinForms equivalent)
- [x] Delete the generic production, traceability, quality, inventory, settings and print screens
- [x] Keep the settings/system group route for the existing users and roles screens
- [x] Remove stale permission codes, role JSON entries and locale keys
- [x] Add source-shaped demo screens for order list, production report, hourly output, BOM import and SN print
- [x] Share source column definitions with the corresponding demo table and exports/templates
- [x] `npm run type-check` and `npm run build` pass
- [ ] Commit the cleaned baseline

## Phase 1 — Port framework

- [~] `FormListPage`: header, filter card, toolbar, table, totals footer and result summary
- [ ] `FormDataTable`: row index, numeric alignment, column visibility, CSV export, empty and loading states
- [ ] `EditFormDialog` / edit page: sectioned fields, inline validation, unsaved-changes guard
- [~] `useFormList`: filters, debounced auto-apply, explicit Apply, reset, totals and record count
- [~] `forms.manifest.ts` per module: WinForms class, source path, route, kind, filters, columns, totals, status
- [ ] Generate this checklist and the navigation entries from the manifest
- [~] Service contracts typed from `tengyuesoft\Model`, returning empty results until the API exists
- [x] Module and form permission codes aligned with the demo roles (admin, supervisor, operator)
- [ ] Side-by-side review template for filters, columns, actions, totals, validation and state changes

## Milestone 2 — Order Management

Source: `QDHZMg\OrderMg` (32 forms)

First slice: `FrmProductionReportList`. Then the list screens; edit dialogs after the lists.

- [~] `FrmProductionReportList` — source filters, columns, totals and date handling; deterministic 8-row fixture and source-key CSV export
- [~] `Frm_OrderListWh` — visible columns and date/order/model filters; deterministic 8-row fixture and source-key CSV export
- [ ] `Frm_OrderEdit`
- [ ] `Frm_MultiOrder`
- [ ] `Frm_OrderPartList`
- [ ] `Frm_OrderPartProcess`
- [ ] `Frm_OrderOverWh`
- [ ] `Frm_ProductFilesListWh`
- [ ] `Frm_OnLineListWh`
- [ ] `Frm_OnLineALLListWh`
- [ ] `Frm_ScanListWh`
- [ ] `Frm_ScanDetailListByAssemblyWh`
- [ ] `FrmScanScanDetailReworkList`
- [ ] `Frm_FullProcessTraceabilityListWh`
- [ ] `Frm_Log_SiteWh`
- [ ] `Frm_LogSiteSubListWh`
- [ ] `Frm_ImeiCodeListWh`
- [ ] `Frm_ImeiCodeOrderDetail`
- [ ] `FrmSNChinaList`
- [ ] `FrmSNChinaOrderList`
- [ ] `Frm_SNChinaImpErrorList`
- [ ] `Frm_InstallDetailListWh`
- [ ] `Frm_UserFinishList`
- [ ] `Frm_UserFinishListZXWh`
- [ ] `Frm_DateFinishListZZWh`
- [~] `FrmReportProduceHourJiepaiList` — source columns and deterministic 8-row chart/table fixture; permitted fields only
- [ ] `FrmBoxFinishNoPalletLogList`
- [ ] `FrmBoxFinishNoPalletLogListDelete`
- [ ] `Frm_ExcelJieDu`
- [ ] `Frm_CreateSNProcessMessage`
- [ ] `Frm_ProcessDialog` — shared progress dialog pattern
- [ ] `Frm_OrderSNPrintMessage` — SN print result dialog

## Milestone 3 — Base Data

Source: `QDHZMg\BaseMg` (56 forms including `BaseLeakMg` and `ChargingGasMg`)

Configuration lists first, then their edit forms.

### BaseMg

- [ ] `Frm_FactoryListWh`
- [ ] `Frm_FactoryEdit`
- [ ] `Frm_GroupListWh`
- [ ] `Frm_GroupEdit`
- [ ] `Frm_LineListWh`
- [ ] `Frm_LineEdit`
- [ ] `Frm_LineSubListWh`
- [ ] `Frm_LineSubEdit`
- [ ] `Frm_LineSiteWh`
- [ ] `Frm_LineSiteScanUserWh`
- [ ] `Frm_SiteListWh`
- [ ] `Frm_SiteEdit`
- [ ] `Frm_SiteQCListWh`
- [ ] `Frm_SiteQCEdit`
- [ ] `Frm_ClassesListWh`
- [ ] `Frm_ClassesEdit`
- [ ] `Frm_ModelNumberListWh`
- [ ] `Frm_ModelNumberEdit`
- [ ] `Frm_ModelNumberImpErrorList`
- [ ] `Frm_ModelSeriesWh`
- [ ] `Frm_ModelSeriesEdit`
- [ ] `Frm_ModelSiteWh`
- [ ] `Frm_MaterialArchiveListWh`
- [ ] `Frm_MaterialArchiveEdit`
- [ ] `Frm_SupplierListWh`
- [ ] `Frm_SupplierEdit`
- [ ] `Frm_BoxCodeMainListWh`
- [ ] `Frm_BoxCodeMainEdit`
- [ ] `Frm_PalletCodeMainListWh`
- [ ] `Frm_PalletCodeMainEdit`
- [ ] `Frm_ColorListWh`
- [ ] `Frm_ColorEdit`
- [ ] `Frm_CityListWh`
- [ ] `Frm_CityEdit`
- [ ] `Frm_CoilListWh`
- [ ] `Frm_CoilEdit`
- [ ] `Frm_StyleWh`
- [ ] `Frm_StyleEdit`
- [ ] `Frm_StyleSubEdit`
- [ ] `FrmBaseFormNameList`
- [ ] `FrmBaseFormNameEdit`
- [ ] `FrmBaseConnectPipeModelList`
- [ ] `FrmBaseConnectPipeModelEdit`
- [ ] `FrmBaseModelHourJiepaiList`
- [ ] `FrmBaseModelHourJiepaiEdit`
- [ ] `FrmOPCCONFIGList`
- [ ] `FrmOPCCONFIGEdit`
- [ ] `Frm_LeaksConfigWh`
- [ ] `Frm_LeaksConfigEdit`
- [ ] `Frm_SiteSelect`
- [ ] `Frm_CoilListSel`

### BaseMg\BaseLeakMg

- [ ] `FrmBaseLeaksConfigModelList`
- [ ] `FrmBaseLeaksConfigModelEdit`
- [ ] `Frm_GasSelect`

### BaseMg\ChargingGasMg

- [ ] `FrmBaseChargingGasConfigModelList`
- [ ] `FrmBaseChargingGasConfigModelEdit`

## Milestone 3 — System and Access

Source: `QDHZMg\SysMg` (34 forms including `StyleSub`)

Keep the existing users and roles demo; port the remaining menu, role, button and system configuration forms.

- [ ] `Frm_UserNewListWh`
- [ ] `Frm_UserNewEdit`
- [ ] `Frm_RoleListWh`
- [ ] `Frm_RoleEdit`
- [ ] `Frm_RoleQx`
- [ ] `Frm_RoleQxNew`
- [ ] `Frm_RoleQxNewButtonOrder`
- [ ] `Frm_MenuListWh`
- [ ] `Frm_MenuEdit`
- [ ] `Frm_ModuleListWh`
- [ ] `Frm_ModuleEdit`
- [ ] `Frm_ButtonListWh`
- [ ] `Frm_ButtonEdit`
- [ ] `Frm_DepartmentListWh`
- [ ] `Frm_DepartmentEdit`
- [ ] `Frm_LanguageWh`
- [ ] `Frm_LanguageEdit`
- [ ] `Frm_LanguageDetailWh`
- [ ] `Frm_LanguageDetailEdit`
- [ ] `Frm_LicenseWh`
- [ ] `Frm_LicenseAdd`
- [ ] `Frm_LicenseEdit`
- [ ] `FrmKanBanRoleList`
- [ ] `FrmKanBanRoleEdit`
- [ ] `FrmSystemServerList`
- [ ] `FrmSystemServerEdit`
- [ ] `FrmTdatacolList`
- [ ] `FrmUpdatefileBakExeList`
- [ ] `FrmUpFile`
- [ ] `FrmUpFileEdit`
- [ ] `Frm_SelectImage`
- [ ] `Frm_Pwd`
- [ ] `FrmBasestylesubList`
- [ ] `FrmBasestylesubEdit`

### Users and Access — demo baseline

- [x] Add desktop-style user identity, department, contact, status, authority, photo URL, factory, role and warehouse fields
- [x] Load demo departments, roles and users from project JSON; persist edits in browser storage and migrate earlier demo records
- [x] Resolve sign-in role and scope from the active managed account; reject unknown, inactive, or non-employed accounts
- [x] Edit role access in a module/action permission tree and preserve administrator management access
- [x] Scope current demo screens to the demo factory and inventory records to assigned warehouses
- [ ] Align the role/menu matrix with the database-driven `RolemenuInfoImp.GetMenuListByRole` behavior
- [ ] Run acceptance review against the WinForms behavior and refine demo edge cases

## Milestone 4 — OQC and Quality

Source: `QDHZMg\OQCMg` (53 forms) and `QDHZMg\QualityControl` (2 forms)

- [ ] `Frm_OQCItemListWh`
- [ ] `Frm_OQCItemEdit`
- [ ] `Frm_ModelOQCItemWh`
- [ ] `Frm_ModelOQCSet`
- [ ] `FrmBaseModelMaterialEdit`
- [ ] `Frm_OQCMaterialListWh`
- [ ] `Frm_OQCMaterialEdit`
- [ ] `Frm_OQCProblemListWh`
- [ ] `Frm_OQCProblemEdit`
- [ ] `Frm_OQCProblemTypeListWh`
- [ ] `Frm_OQCProblemTypeEdit`
- [ ] `Frm_OQCProblemLocationListWh`
- [ ] `Frm_OQCProblemLocationEdit`
- [ ] `Frm_OQCSolutionListWh`
- [ ] `Frm_OQCSolutionEdit`
- [ ] `Frm_OQCStandardListWh`
- [ ] `Frm_OQCSNList`
- [ ] `Frm_OQCSNRepairList`
- [ ] `Frm_OQCSNCellRepairList`
- [ ] `Frm_OQCPalletList`
- [ ] `Frm_OQCPalletConfirm`
- [ ] `FrmQCSamplingSammaryList`
- [ ] `FrmScanGroupConfirmList`
- [ ] `FrmScanGroupConfirmListInjection`
- [ ] `FrmScanGroupLockList`
- [ ] `FrmScanGroupLockListInjection`
- [ ] `Frm_BOMListWh`
- [~] `Frm_BOMImport` — canonical nine headers, `BOMList` worksheet, eight-row sample workbook and validated header check
- [ ] `Frm_Warehouse_QCList`
- [ ] `Frm_Warehouse_QCEdit`
- [ ] `FrmStopDataList`
- [ ] `FrmStopDataDetailList`
- [ ] `FrmStopDataRestList`
- [ ] `FrmStopDataSNList`
- [ ] `FrmStopDataSNRepairList`
- [ ] `FrmStopDataOEEList`
- [ ] `FrmStopDataOEEListInjection`
- [ ] `FrmStopDataOEEListOnly`
- [ ] `FrmStopDataOEEExploitationList`
- [ ] `FrmStopDataOEEExploitationListInjnection`
- [ ] `FrmStopDataOEEExploitationListNew`
- [ ] `FrmStopDataOEEReason`
- [ ] `FrmStopDataOEESNList`
- [ ] `Frm_OrderImport`
- [ ] `FrmStopModelQtyList`
- [ ] `FrmStopModelQtyEdit`
- [ ] `Frm_StopModelQtyImport`
- [ ] `FrmStopModelTaktList`
- [ ] `FrmStopModelTaktEdit`
- [ ] `FrmStopWorkerQtyList`
- [ ] `FrmStopWorkerQtyEdit`
- [ ] `FrmStopClassesRestList`
- [ ] `FrmStopClassesRestEdit`
- [ ] `Frm_OQCCheckListWh`
- [ ] `Frm_OQCLogin`

## Milestone 5 — Warehouse

Source: `QDHZMg\WareHouseMg` (27 forms)

- [ ] `Frm_InventoryListListWh`
- [ ] `Frm_InventoryListEdit`
- [ ] `Frm_InventoryDifference`
- [ ] `Frm_InventoryFx`
- [~] `Frm_StockListHz` — verified visible columns, assigned-warehouse filtering and deterministic sample rows
- [ ] `Frm_StockListHzMx`
- [ ] `Frm_AllocateListWh`
- [ ] `Frm_AllocateListEdit`
- [ ] `Frm_AllocateListHz`
- [ ] `Frm_AllocateListHzMxIn`
- [ ] `Frm_AllocateListHzMxOut`
- [ ] `Frm_DeliveryPlanListWh`
- [ ] `Frm_DeliveryPlanListEdit`
- [ ] `Frm_DeliveryMXList`
- [ ] `Frm_DeliveryModelSelect`
- [ ] `Frm_ScanInStorageListWh`
- [ ] `Frm_ScanInStorageDetailList`
- [ ] `Frm_PalletNotIn`
- [ ] `Frm_PalletNotInMx`
- [ ] `Frm_WareHouseListWh`
- [ ] `Frm_WareHouseEdit`
- [ ] `Frm_WareHouseListXzWh`
- [ ] `Frm_WareHouseReturn`
- [ ] `Frm_UserWareHouseList`
- [ ] `Frm_UserWareHouseListSelect`
- [ ] `Frm_CustomerWareHouseRelationWh`
- [ ] `Frm_LogListWh`

## Milestone 6 — Semi-Final, Injection and SFG

### SemiFinal (15 forms)

- [ ] `Frm_SemiFinal_OrderListWh`
- [ ] `Frm_SemiFinal_OrderEdit`
- [ ] `Frm_SemiFinal_ModelNumberListWh`
- [ ] `Frm_SemiFinal_ModelNumberEdit`
- [ ] `Frm_SemiFinal_ModelSiteWh`
- [ ] `Frm_SemiFinal_ModelHourJiepaiList`
- [ ] `Frm_SemiFinal_ModelHourJiepaiEdit`
- [ ] `Frm_SemiFinal_BOMListWh`
- [ ] `Frm_SemiFinal_SiteListWh`
- [ ] `Frm_SemiFinal_SiteEdit`
- [ ] `Frm_Semifinal_PQCProblemListWh`
- [ ] `Frm_Semifinal_PQCProblemEdit`
- [ ] `Frm_Semifinal_ScanList`
- [ ] `Frm_SemiFinal_ModelSelect`
- [ ] `Frm_SemiFinal_SiteSelect`

### InjectionMg (9 forms)

- [ ] `FrmBaseModelNumberInjectionList`
- [ ] `FrmBaseModelNumberInjectionEdit`
- [ ] `FrmMachineModelTaktList`
- [ ] `FrmMachineModelTaktEdit`
- [ ] `FrmMachineModelTaktImport`
- [ ] `FrmScanBaseOrderInjectionList`
- [ ] `FrmScanBaseOrderInjectionEdit`
- [ ] `FrmScanBaseOrderInjectionImp`
- [ ] `FrmScanBaseOrderInjectionLock`

### SFGMg (18 forms)

- [ ] `Frm_OrderPartSFGList`
- [ ] `Frm_OrderPartProcessSFG`
- [ ] `FrmSFGMachineList`
- [ ] `FrmSFGMachineEdit`
- [ ] `FrmSFGMouldList`
- [ ] `FrmSFGMouldEdit`
- [ ] `FrmSFGPartStyleList`
- [ ] `FrmSFGPartStyleEdit`
- [ ] `FrmSFGScanDataList`
- [ ] `FrmSFGScanDataEditInjection`
- [ ] `FrmSFGScanDataReceiveList`
- [ ] `FrmSFGScanDataSNList`
- [ ] `FrmSFGPQCBlockList`
- [ ] `FrmSFGStopDataList`
- [ ] `FrmSFGStopReasonList`
- [ ] `FrmSFGStopReasonEdit`
- [ ] `FrmSFGStopTypeList`
- [ ] `FrmSFGStopTypeEdit`

## Milestone 7 — Equipment, Security Machine and E-Kanban

### EquipementInstruments (11 forms)

- [ ] `Frm_Leaks_ScanList`
- [ ] `Frm_Vacuum_ScanList`
- [ ] `Frm_Gas_ScanList`
- [ ] `Frm_Entropy_CheckList`
- [ ] `Frm_Entropy_CheckList_Ac`
- [ ] `Frm_Foaming_List`
- [ ] `Frm_AutoRepair_ScanList`
- [ ] `Frm_AutoRepair_ScanListPackag`
- [ ] `Frm_Machine_ScanList`
- [ ] `Frm_Scan_ScanList`
- [ ] `Frm_SecurityMachine_ScanList`

### SecurityMachine (18 forms)

- [ ] `Frm_SecurityMachine_MachineList`
- [ ] `Frm_SecurityMachine_MachineEdit`
- [ ] `Frm_SecurityMachine_ArchivesEdit`
- [ ] `Frm_SecurityMachine_DbList`
- [ ] `Frm_MachineSelect`
- [ ] `Frm_SecurityMachine_TestItemConfigWh`
- [ ] `Frm_SecurityMachine_TestItemConfigEdit`
- [ ] `Frm_SecurityMachine_TestItemEdit`
- [ ] `FrmDryerAirDataList`
- [ ] `FrmDryerAirDataEdit`
- [ ] `FrmNoiseDataList`
- [ ] `FrmNoiseDataEdit`
- [ ] `FrmOilDataList`
- [ ] `Frm_OilData`
- [ ] `FrmPerformanceDataList`
- [ ] `FrmIntegratedDataList`
- [ ] `FrmIntegratedDataEdit`
- [!] `Frm_SecurityMachine_ScanList _bak` — backup form, do not port

### Ekanban (13 forms)

- [ ] `FrmEKanbanSetList`
- [ ] `FrmEKanbanSetEdit`
- [ ] `FrmEKanbanQtychartDataList`
- [ ] `FrmEKanbanQtyglobalQuantitiesList`
- [ ] `FrmEKanbanQtyinspectionsList`
- [ ] `FrmEKanbanQtykpisList`
- [ ] `FrmEKanbanQtyquantityProducedList`
- [ ] `FrmEKanbanRepairrepairedChartDataList`
- [ ] `FrmEKanbanRepairtopDefectsList`
- [ ] `FrmEKanbanRepairtopRepairReportList`
- [ ] `FrmEKanbanRepairtopValuesList`
- [ ] `FrmTopUserList`
- [ ] `FrmTopUserEdit`

## Milestone 8 — Sales and AC

### SaleMg (17 forms)

- [ ] `Frm_CustomerListWh`
- [ ] `Frm_CustomerListWhIT`
- [ ] `Frm_CustomerEdit`
- [ ] `Frm_CustomerImpErrorList`
- [ ] `Frm_DistributorsListWh`
- [ ] `Frm_DistributorsDetail`
- [ ] `Frm_ConsumerListWh`
- [ ] `Frm_ConsumerDetail`
- [ ] `Frm_COrderListWh`
- [ ] `Frm_COrderDetail`
- [ ] `Frm_DOrderListWh`
- [ ] `Frm_DOrderList`
- [ ] `Frm_SNSalesListWh`
- [ ] `Frm_SNSalesDetail`
- [ ] `Frm_ModelPriceWh`
- [ ] `Frm_ModelPriceEdit`
- [ ] `Frm_ParentWh`

### ACMg (3 forms)

- [ ] `FrmMySqlChargingGasDataList`
- [ ] `FrmMySqlVaccumDataList`
- [ ] `FrmMySqlPerformanceDataList`

## Shared dialogs and shell

`QDHZMg\Common` (9 forms) — reusable pickers and dialogs, not routes

- [ ] `Frm_FormName`
- [ ] `Frm_LineSiteSelect`
- [ ] `Frm_ModelSelect`
- [~] `Frm_MultiInputPrint` — PrintOrdersnInfo fields and source-limited sample label preview; BarTender output remains unavailable in web demo
- [ ] `Frm_OQCItemSelect`
- [ ] `Frm_OQCSolSelect`
- [ ] `Frm_OQCStdGridSelect`
- [ ] `Frm_UserSiteSet`
- [ ] `FrmPwdConfim`

`QDHZMg\` root (3 forms) — application shell

- [x] `Frm_login` — replaced by the web login/profile picker; keep for reference
- [x] `Frm_main` — menu replaced by the web shell; menu data originates from the database
- [x] `Frm_Base` — replaced by the modern form shell

## Deferred to the API phase

- [!] SAP integration — `tengyuesoft\DataImp\SapMg` has data access but no WinForms screens
- [!] Oracle WMS storage integration — `tengyuesoft\DataImp\OracleWMS` has no WinForms screens
- [ ] Print/Barcode — track inside the owning modules (`Frm_OrderSNPrintMessage`, `Frm_MultiInputPrint`, box and pallet code forms); no standalone module

## Verification

- Compare every port against the `.cs` and `.Designer.cs`: filters and defaults, columns and visibility, toolbar actions, totals, validation and state changes
- Run `npm run type-check` and `npm run build` after each module group
- Mark a form `[x]` only after the review is complete
