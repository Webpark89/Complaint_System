import { ActiveStatus, OrganizationType } from '#contracts/enum'

export const organizations = [
  {
    id: 1,
    parent_organization_id: null,
    title: 'บริษัท เอ แอล ปาล์ม จำกัด',
    type: OrganizationType.COMPANY,
    status: ActiveStatus.ACTIVE,
    created_by: 0,
    updated_by: 0,
  },
  {
    id: 2,
    parent_organization_id: 1,
    title: 'บริษัท กลุ่มสมอทอง จำกัด (มหาชน) สำนักงานใหญ่',
    type: OrganizationType.BRANCH,
    status: ActiveStatus.ACTIVE,
    created_by: 0,
    updated_by: 0,
  },
  {
    id: 3,
    parent_organization_id: 1,
    title: 'บริษัท กลุ่มสมอทอง จำกัด (มหาชน) สาขาท่าชนะ',
    type: OrganizationType.BRANCH,
    status: ActiveStatus.ACTIVE,
    created_by: 0,
    updated_by: 0,
  },
  {
    id: 4,
    parent_organization_id: 1,
    title: 'บริษัท กลุ่มสมอทอง จำกัด (มหาชน) สาขาพนม',
    type: OrganizationType.BRANCH,
    status: ActiveStatus.ACTIVE,
    created_by: 0,
    updated_by: 0,
  },
  {
    id: 5,
    parent_organization_id: 1,
    title: 'บริษัท กลุ่มสมอทอง จำกัด (มหาชน) สาขาสระบุรี',
    type: OrganizationType.BRANCH,
    status: ActiveStatus.ACTIVE,
    created_by: 0,
    updated_by: 0,
  },
]
