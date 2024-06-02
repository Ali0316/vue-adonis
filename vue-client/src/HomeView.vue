<script setup lang="js">
import axios from 'axios'
import {ref} from 'vue'
import { useForm } from 'vee-validate'
// import {useRouter} from 'vue-router';
import {store} from './store';

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

// const router = useRouter();

let buttonRef = ref('Submit')
let isSubmitting = ref(false)

const form = useForm()
const onSubmit = form.handleSubmit(async (values) => {
  try {
    isSubmitting.value = true;
    buttonRef.value = 'Submitting....'
    let res = await axios.post("http://localhost:3333/csv/upload",values,{
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${store.token}`
      }
    })

    if(res.status === 201){
      buttonRef.value = 'File Uploaded Successfully'
    }
  } catch (error){
    console.log(error);
  }
})

const downloadXLSX = async () => {
  try{
    const res = await axios.get('http://localhost:3333/csv/download',{
      headers: {
        'Authorization': `Bearer ${store.token}`
      }
    })

    if(res.error){
      throw new Error(res);
    }

     const url = window.URL.createObjectURL(new Blob([res]))
     const link = document.createElement('a')
     link.href = url

     link.setAttribute('download', 'stock.xlsx')
     document.body.appendChild(link)
     link.click()
  }catch(error){
    console.log(error)
  }
}
</script>

<template>
  <main class="w-full h-screen flex flex-col justify-center items-center">
    <Card class="w-full max-w-sm">
      <CardHeader>
        <CardTitle class="text-2xl"> Submit CSV File </CardTitle>
        <CardDescription>
          Click the button below to submit a CSV file.
        </CardDescription>
      </CardHeader>
      <form @submit="onSubmit">
        <CardContent class="grid gap-4">
          <FormField v-slot="{ componentField }" class="grid gap-2" name="file">
            <FormItem>
              <FormLabel>Upload a File</FormLabel>
              <FormControl>
                <Input type="file" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </CardContent>
        <CardFooter>
          <Button class="w-full" :disabled="isSubmitting" type="submit">
            {{ buttonRef }}
          </Button>
        </CardFooter>
      </form>

      <CardHeader>
        <CardDescription>
          Click the button below to download the XLSX file.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button @:click="downloadXLSX" class="w-full">Download XLSX</Button>
      </CardContent>
    </Card>
  </main>
</template>
