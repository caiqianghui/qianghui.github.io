
export interface Module {
  category: string;
  type?: string;
  id?: string;
  moduleName: string;
  name: string;
  pathname: string;
  permissions?: boolean;
  selects?: Array<string>;
  isNew?: boolean;
  isAdmin?: boolean;
  logo_url?: string;
  path?: string;
  btns?: Array<{
    key: string;
    text: string;
  }>;
  screenLayout?: Array<{
    api_name: string;
    field_label: string;
    id?: string;
    active: boolean,
    type: string,
    value: string;
  }>;
  sortFields?: Array<{
    api_name: string;
    field_label: string;
  }>
}

interface MenuModule {
  category: string;
  name: string;
  children: Array<Module>;
}

const ltcMenu: MenuModule = {
  category: 'menu',
  name: 'L T C',
  children: [
    {
      category: 'sub_menu',
      type: 'crm',
      id: '181037000075716763',
      name: '线索',
      moduleName: 'Leads',
      pathname: 'zoho/list',
      permissions: false,
      btns: [{ key: 'topublicleads1', text: '丢入公海' }],
      selects: ['Company', 'Full_Name', 'Phone', 'Release_Time'],
      screenLayout: [
        {
          api_name: "Rating",
          field_label: "等级",
          active: false,
          value: '',
          type: '',
        },
        {
          api_name: "Last_Name",
          field_label: "客户联系人",
          active: false,
          value: '',
          type: '',
        },
        {
          api_name: "Lead_Source",
          field_label: "线索来源",
          active: false,
          value: '',
          type: '',
        },
        {
          api_name: "Owner",
          field_label: "线索所有者",
          active: false,
          value: '',
          type: '',
        },
        {
          api_name: "Street",
          field_label: "省/市/区/县",
          active: false,
          value: '',
          type: '',
        },
        {
          api_name: "Region",
          field_label: "客户所属大区",
          active: false,
          value: '',
          type: '',
        },
        {
          api_name: "Account_Department",
          field_label: "客户所属部门",
          active: false,
          value: '',
          type: '',
        },
        {
          api_name: "War_Zone",
          field_label: "客户所属战区",
          active: false,
          value: '',
          type: '',
        },
        {
          api_name: "Claimed",
          field_label: "被申领的线索",
          active: false,
          value: '',
          type: '',
        },
      ],
      sortFields: [
        {
          api_name: 'Release_Time',
          field_label: '释放日期',
        },
        {
          api_name: 'Rating',
          field_label: '等级',
        },
        {
          api_name: 'Account_Name',
          field_label: '客户名称',
        },
        {
          api_name: 'Last_Name',
          field_label: '客户联系人',
        },
        {
          api_name: 'Lead_Source',
          field_label: '线索来源',
        },
        {
          api_name: 'Owner',
          field_label: '线索所有者',
        },
        {
          api_name: 'Last_Activity_Time',
          field_label: '最近操作时间',
        }
      ]
    },
    {
      category: 'sub_menu',
      type: 'crm',
      id: '181037000000060547',
      permissions: false,
      name: '商机',
      moduleName: 'Deals',
      pathname: 'zoho/list',
      selects: ['Deal_Name', 'Stage', 'Amount', 'Rating', 'phone'],
      screenLayout: [
        {
          api_name: "Deal_Name",
          field_label: "商机名称",
          active: false,
          value: '',
          type: '',
          
        },
        {
          api_name: "Account_Name",
          field_label: "客户名称",
          active: false,
          value: '',
          type: '',
        },
        {
          api_name: "Stage",
          field_label: "阶段",
          active: false,
          value: '',
          type: '',
        },
        {
          api_name: "Rating",
          field_label: "等级",
          active: false,
          value: '',
          type: '',
        },
        {
          api_name: "Owner",
          field_label: "商机所有者",
          active: false,
          value: '',
          type: '',
        },
        {
          api_name: "Lead_Source",
          field_label: "线索来源",
          active: false,
          value: '',
          type: '',
        },
        
      ],
      sortFields: [
        {
          api_name: 'Deal_Name',
          field_label: '商机名称',
        },
        {
          api_name: 'Account_Name',
          field_label: '客户名称',
        },
        {
          api_name: 'Stage',
          field_label: '阶段',
        },
        {
          api_name: 'Rating',
          field_label: '等级',
        },
        {
          api_name: 'Owner',
          field_label: '商机所有者',
        },
        {
          api_name: 'Lead_Source',
          field_label: '线索来源',
        },
        {
          api_name: 'Last_Activity_Time',
          field_label: '最近操作时间',
        }
      ]
    },
    {
      category: 'sub_menu',
      type: 'crm',
      id: '181037000000060567',
      permissions: false,
      name: '客户',
      moduleName: 'Accounts',
      pathname: 'zoho/list',
      selects: ['Account_Name', 'Department', 'Phone'],
      screenLayout: [
        {
          api_name: "Account_Name",
          field_label: "客户名称",
          active: false,
          value: '',
          type: '',
        },
        {
          api_name: "Account_Code",
          field_label: "客户代码",
          active: false,
          value: '',
          type: '',
        },
        {
          api_name: "Phone",
          field_label: "电话",
          active: false,
          value: '',
          type: '',
        },
        {
          api_name: "SAP_Code",
          field_label: "SAP客户标识",
          active: false,
          value: '',
          type: '',
        },
        {
          api_name: "Street",
          field_label: "区/县",
          active: false,
          value: '',
          type: '',
        },
        {
          api_name: "Account_Source",
          field_label: "客户来源",
          active: false,
          value: '',
          type: '',
        },
        {
          api_name: "Region",
          field_label: "客户所属大区",
          active: false,
          value: '',
          type: '',
        },
        {
          api_name: "Department",
          field_label: "客户所属部门",
          active: false,
          value: '',
          type: '',
        },
        {
          api_name: "War_Zone",
          field_label: "客户所属战区",
          active: false,
          value: '',
          type: '',
        },
      ],
      sortFields: [
        {
          api_name: 'Account_Name',
          field_label: '客户名称',
        },
        {
          api_name: 'Account_Code',
          field_label: '客户代码',
        },
        {
          api_name: 'Phone',
          field_label: '电话',
        },
        {
          api_name: 'SAP_Code',
          field_label: 'SAP客户标识',
        },
        {
          api_name: 'Province',
          field_label: '省',
        },
        {
          api_name: 'District',
          field_label: '市',
        },
        {
          api_name: 'Account_Source',
          field_label: '客户来源',
        },
      ]
    },
    {
      category: 'sub_menu',
      type: 'crm',
      id: '181037000000299602',
      permissions: false,
      name: '线索公海',
      moduleName: 'Public_Leads',
      pathname: 'zoho/list',
      btns: [{ key: 'clueclaim1', text: '线索申领' }],
      selects: ['Name', 'Last_Name', 'Phone', 'Rating'],
      screenLayout: [
        {
          api_name: "Rating",
          field_label: "等级",
          active: false,
          value: '',
          type: '',
        },
        {
          api_name: "Last_Name",
          field_label: "客户联系人",
          active: false,
          value: '',
          type: '',
        },
        {
          api_name: "Lead_Source",
          field_label: "线索来源",
          active: false,
          value: '',
          type: '',
        },
        {
          api_name: "Owner",
          field_label: "线索所有者",
          active: false,
          value: '',
          type: '',
        },
        {
          api_name: "Street",
          field_label: "区/县",
          active: false,
          value: '',
          type: '',
        },
        {
          api_name: "Region",
          field_label: "客户所属大区",
          active: false,
          value: '',
          type: '',
        },
        {
          api_name: "Account_Department",
          field_label: "客户所属部门",
          active: false,
          value: '',
          type: '',
        },
        {
          api_name: "War_Zone",
          field_label: "客户所属战区",
          active: false,
          value: '',
          type: '',
        },
        {
          api_name: "Claimed",
          field_label: "被申领的线索",
          active: false,
          value: '',
          type: '',
        },
      ],
      sortFields: [
        {
          api_name: 'Release_Time',
          field_label: '释放日期',
        },
        {
          api_name: 'Rating',
          field_label: '等级',
        },
        {
          api_name: 'Account_Name',
          field_label: '客户名称',
        },
        {
          api_name: 'Last_Name',
          field_label: '客户联系人',
        },
        {
          api_name: 'Lead_Source',
          field_label: '线索来源',
        },
        {
          api_name: 'Owner',
          field_label: '线索所有者',
        },
        {
          api_name: 'Last_Activity_Time',
          field_label: '最近操作时间',
        }
      ]
    },
    {
      category: 'sub_menu',
      id: '181037000000299603',
      name: '签到',
      moduleName: 'signin',
      type: 'crm',
      pathname: 'cloud/signin',
      path: 'signin',
    },
    {
      category: 'sub_menu',
      id: '18103700000299603',
      name: '客户查重',
      moduleName: 'accounts_h',
      pathname: 'zoho/accounts_h',
      type: 'crm',
    },
    {
      category: 'sub_menu',
      id: '1811111111231341119603',
      name: '电话开发',
      type: 'crm',
      permissions: false,
      moduleName: 'TelephoneDevelopment',
      pathname: 'zoho/list',
      selects: ['company_name', 'Name', 'phone', 'Owner', 'status', 'Last_dialed_time '],
      btns: [{ key: 'delete', text: '删除' }],
      screenLayout: [
        {
          api_name: "status",
          field_label: "状态",
          active: true,
          value: '未拨打',
          type: '=',
        },
        {
          api_name: "Name",
          field_label: "名字",
          active: false,
          value: '',
          type: '',
        },
        {
          api_name: "phone",
          field_label: "电话",
          active: false,
          value: '',
          type: '',
        },
        {
          api_name: "Owner",
          field_label: "电话开发所有者",
          active: false,
          value: '',
          type: '',
        },
      ],
      sortFields: [
        {
          api_name: 'status',
          field_label: '状态',
        },
        {
          api_name: "Last_dialed_time",
          field_label: "最近拨打时间",
        },
        {
          api_name: 'Name',
          field_label: '名字',
        },
        {
          api_name: 'phone',
          field_label: '电话',
        },
      ]
    },
    {
      category: 'sub_menu',
      id: '181037000120484793',
      name: '竞品价格反馈',
      type: 'crm',
      moduleName: 'CompetitionInformationFeedback',
      permissions: false,
      pathname: 'zoho/Information_h',
      selects: ['Name', 'laser_brand', 'payment_method', 'competition_model', 'Owner', 'main_configuration_description '],
      screenLayout: [
        {
          api_name: "Name",
          field_label: "竞品名称",
          active: false,
          value: '',
          type: '=',
        },
        {
          api_name: "competition_power",
          field_label: "竞品功率",
          active: false,
          value: '',
          type: '',
        },
        {
          api_name: "final_transaction_price",
          field_label: "最终成交价",
          active: false,
          value: '',
          type: '',
        },
        {
          api_name: "warranty_period",
          field_label: "质保年限",
          active: false,
          value: '',
          type: '',
        },
      ],
      sortFields: [
        {
          api_name: 'Name',
          field_label: '竞品名称',
        },
        {
          api_name: "competition_power",
          field_label: "竞品功率",
        },
        {
          api_name: 'final_transaction_price',
          field_label: '最终成交价',
        },
        {
          api_name: 'warranty_period',
          field_label: '质保年限',
        },
      ]
    },
  ],
};

const ctoMenu: MenuModule = {
  category: 'menu',
  name: 'C T O',
  children: [
    {
      category: 'sub_menu',
      name: '合同',
      permissions: true,
      type: 'cloud',
      moduleName: 'Contracts',
      pathname: 'cloud/list',
      isNew: false,
      isAdmin: false,
    },
    {
      category: 'sub_menu',
      name: '销售订单',
      type: 'cloud',
      permissions: true,
      moduleName: 'SalesOrder',
      pathname: 'cloud/list',
      isNew: true,
      isAdmin: true,
    },
    {
      category: 'sub_menu',
      name: '接待打样',
      type: 'cloud',
      permissions: true,
      moduleName: 'ReceptionProofing',
      pathname: 'cloud/list',
      isNew: true,
      isAdmin: true,
    },
    {
      category: 'sub_menu',
      name: '整机发货单',
      type: 'cloud',
      permissions: true,
      moduleName: 'ModelInvoiceOrder',
      pathname: 'cloud/list',
      isNew: false,
      isAdmin: true,
    },
    {
      category: 'sub_menu',
      name: '整机退换货',
      type: 'cloud',
      permissions: true,
      moduleName: 'ModelReturnOrder',
      pathname: 'cloud/list',
      isNew: false,
      isAdmin: true,
    },
    {
      category: 'sub_menu',
      name: '合同授信',
      type: 'cloud',
      permissions: true,
      moduleName: 'AccountCredit',
      pathname: 'cloud/list',
      isNew: true,
      isAdmin: true,
    },
    {
      category: 'sub_menu',
      name: '配件商城优惠券',
      type: 'cloud',
      permissions: true,
      moduleName: 'PartsMallCoupons',
      pathname: 'cloud/list',
      isNew: true,
      isAdmin: true,
    },
    {
      category: 'sub_menu',
      name: '非标整机',
      type: 'cloud',
      permissions: true,
      moduleName: 'Non_Standard_Quotation',
      pathname: 'cloud/list',
      isNew: true,
      isAdmin: true,
    },
  ]
}

const signInTypes = [
  {label: '拜访B+商机/线索', value: '拜访B+商机/线索', color: '#ec2c64'},
  {label: '拜访询盘客户', value: '拜访询盘客户', color: '#584717'},
  {label: '拜访其他客户', value: '拜访其他客户', color: '#7e1671'},
  {label: '拜访竞品客户', value: '拜访竞品客户', color: '#5cb3cc'},
  {label: '陌拜开发', value: '陌拜开发', color: '#69a794'},
  {label: '展会开发', value: '展会开发', color: '#d0deaa'},
  {label: '回访-自己老客户', value: '回访-自己老客户', color: '#de7622'},
  {label: '回访-同事老客户', value: '回访-同事老客户', color: '#69a794'},
  {label: '陪同拜访/开发', value: '陪同拜访/开发', color: '#3170a7'},
]

const signInMoudles = [
  {label: '线索', value: 'Leads', disabled: false},
  {label: '商机', value: 'Deals', disabled: false},
  {label: '线索公海', value: 'Public_Leads', disabled: false},
];

const dealsBlueprint = [
  {label: '资质审查', icon: null, key: '1', color: '#e972fd'},
  {label: '需求分析', icon: null, key: '2', color: '#4137be'},
  {label: '决策体系', icon: null, key: '3', color: '#fea36a'},
  {label: '合约过程', icon: null, key: '4', color: '#999999'},
  {label: '赢单关闭', icon: 'LikeOutline', key: '5', color: '#25b52a'},
  {label: '丢单关闭', icon: 'LikeOutline', key: '6', color: '#eb4d4d'},
  {label: '客户计划变更', icon: 'LikeOutline', key: '7', color: '#e972fd'},
];


export default {ltcMenu, ctoMenu, signInTypes, signInMoudles, dealsBlueprint};
