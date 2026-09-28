import { type Data } from '~/generated/data'
import { UserModuleMode } from '#contracts/enum'

export default function PermissionRow({
  data,
  defaultValues,
  disabled,
  onChange,
}: {
  data: Data.UserModule
  defaultValues: number[] | null
  disabled: boolean
  onChange?: (e: any) => void
}) {
  const actionList: Record<string, any> = {}
  const actionListOther: any[] = []
  data.actions.forEach((a: any) => {
    if (
      a.code === 'view' ||
      a.code === 'create' ||
      a.code === 'edit' ||
      a.code === 'delete' ||
      a.code === 'export'
    ) {
      actionList[a.code] = a
    } else {
      actionListOther.push(a)
    }
  })
  if (data.mode === UserModuleMode.PARENT) {
    return (
      <tr>
        <th
          colSpan={7}
          align="left"
          className="border-b border-gray-200 p-4 pb-3 text-left font-medium text-gray-400 dark:border-gray-600 dark:text-gray-200"
        >
          {data.title}
        </th>
      </tr>
    )
  } else {
    // dashboard access is mandatory for every role and cannot be unchecked
    const isDashboard = data.module === 'dashboard'
    return (
      <tr className="border-b border-gray-200 text-left font-medium dark:border-gray-600 dark:text-gray-200">
        <th align="left" className="p-2 pl-10 text-left">
          {data.title}
        </th>
        {['view', 'create', 'edit', 'delete'].map((e: string) =>
          actionList[e] ? (
            <td key={actionList[e].id}>
              <label>
                <input
                  type="checkbox"
                  name="permissions"
                  value={actionList[e].id}
                  defaultChecked={isDashboard || defaultValues?.includes(actionList[e].id)}
                  onChange={onChange}
                  disabled={isDashboard || disabled}
                />{' '}
                {actionList[e].action}
              </label>
            </td>
          ) : (
            <td key={`${data.id}-${e}`} />
          )
        )}
        {actionListOther.map((act: any) => (
          <td key={act.id}>
            <label>
              <input
                type="checkbox"
                name="permissions"
                value={act.id}
                defaultChecked={isDashboard || defaultValues?.includes(act.id)}
                onChange={onChange}
                disabled={isDashboard || disabled}
              />{' '}
              {act.action}
            </label>
          </td>
        ))}
      </tr>
    )
  }
  // {module.actions.contains('view') ? (
  //   <td>
  //     <input
  //       type="checkbox"
  //       name={`module_action[${module.code}]`}
  //       value="view"
  //     />{' '}
  //     View
  //   </td>
  // ) : (
  //   <td />
  // )}
  // {module.actions.contains('add') ? (
  //   <td>
  //     <input
  //       type="checkbox"
  //       name={`module_action[${module.code}]`}
  //       value="view"
  //     />{' '}
  //     View
  //   </td>
  // ) : (
  //   <td />
  // )}
  // {module.actions.contains('edit') ? (
  //   <td>
  //     <input
  //       type="checkbox"
  //       name={`module_action[${module.code}]`}
  //       value="view"
  //     />{' '}
  //     View
  //   </td>
  // ) : (
  //   <td />
  // )}
  // {module.actions.contains('delete') ? (
  //   <td>
  //     <input
  //       type="checkbox"
  //       name={`module_action[${module.code}]`}
  //       value="view"
  //     />{' '}
  //     View
  //   </td>
  // ) : (
  //   <td />
  // )}
}
