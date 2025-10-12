import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Database } from '@/database.types'
import { ROUTES } from '@/lib/routes'
import { CreditCardIcon, PlusIcon, Wand2Icon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

interface RecentModelsProps {
  models: Database["public"]["Tables"]["models"]["Row"][]
}

const RecentModels = ({ models }: RecentModelsProps) => {
  return (
    <Card>
        <CardHeader>
          <CardTitle className='text-sm font-medium'>Recent Models</CardTitle>
      </CardHeader>
      <CardContent className='grid gap-4'>
        <div className="space-y-4">
          {models.length === 0 && <p className='text-sm text-muted-foreground'>No models found</p>}
          {models.map((model) => (
            <div key={model.id} className="flex items-center justify-between space-x-4">
              <div>
                <p className='text-sm font-medium'>{model.model_name}</p>
                <p className='text-xs text-muted-foreground'>{model.gender}</p>
              </div>
              <Badge variant={"default"}>{model.training_status}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
      </Card>
  )
}

export default RecentModels

function getStatusVariant(status: string){
  switch(status){
    case 'training':
      return ''
    case 'trained':
      return ''
    case 'failed':
      return 'destructive'
    default:
      return 'default'
  }
}