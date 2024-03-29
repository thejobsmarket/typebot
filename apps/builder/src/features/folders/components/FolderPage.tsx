import { Seo } from '@/components/Seo'
import { DashboardHeader } from '@/features/dashboard/components/DashboardHeader'
import { useToast } from '@/hooks/useToast'
import { useTranslate } from '@tolgee/react'
import { Stack, Flex, Spinner } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { TypebotDndProvider } from '../TypebotDndProvider'
import { FolderContent } from './FolderContent'
import { trpc } from '@/lib/trpc'
import { useWorkspace } from '@/features/workspace/WorkspaceProvider'

export const FolderPage = () => {
  const { t } = useTranslate()
  const router = useRouter()
  const { workspace } = useWorkspace()

  const { showToast } = useToast()

  const { data: { folder } = {} } = trpc.folders.getFolder.useQuery(
    {
      folderId: router.query.id as string,
      workspaceId: workspace?.id as string,
    },
    {
      enabled: !!workspace && !!router.query.id,
      onError: (error) => {
        showToast({
          description: error.message,
        })
      },
    }
  )

  return (
    <Stack minH="100vh">
      <Seo title={t('dashboard.title')} />
      <DashboardHeader />
      <TypebotDndProvider>
        {!folder ? (
          <Flex flex="1">
            <Spinner mx="auto" />
          </Flex>
        ) : (
          <FolderContent folder={folder} />
        )}
      </TypebotDndProvider>
    </Stack>
  )
}
