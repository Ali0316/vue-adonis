<script setup lang="js">
import {ref} from 'vue';
import axios from 'axios'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import {useRouter} from 'vue-router';
import {store} from './store';

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

const router = useRouter();

const formSchema = toTypedSchema(z.object({
  email: z.string({message:"Email should not be empty"}).email({message: 'Invalid email address'}),
  password: z.string({message:"Password should not be empty"}).min(6,{message: "Password should be at least 6 characters"}).max(50, {message: "Password should be at most 50 characters"}),
  rememberMe: z.boolean().default(false),
}))

const form = useForm({
  validationSchema: formSchema,
})

let errors = ref('');
const onSubmit = form.handleSubmit(async (values) => {
  try {
    errors.value = ''
    let res = await axios.post("http://localhost:3333/api/auth/login",values);

    if(res.error){
      throw Error(res);
    }

    router.push('/home');
    store.token = {value: res.data.token, rememberMe: values.rememberMe};

  } catch (error){
    errors.value = error;
  }
})
</script>

<template>
  <main class="w-full h-screen flex flex-col justify-center items-center">
    <Card class="w-full max-w-sm">
      <CardHeader>
        <CardTitle class="text-2xl"> Login </CardTitle>
        <CardDescription>
          {{ errors }}
          Enter your email below to login to your account.
        </CardDescription>
      </CardHeader>
      <form @submit="onSubmit">
        <CardContent class="grid gap-4">
          <FormField
            v-slot="{ componentField }"
            class="grid gap-2"
            name="email"
          >
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="test@example.com"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField
            v-slot="{ componentField }"
            class="grid gap-2"
            name="password"
          >
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="****"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField
            v-slot="{ value, handleChange }"
            type="checkbox"
            name="rememberMe"
          >
            <FormItem class="flex items-center gap-x-3 space-y-0">
              <FormControl>
                <Checkbox :checked="value" @update:checked="handleChange" />
              </FormControl>

              <FormLabel>Remember Me</FormLabel>
            </FormItem>
          </FormField>
        </CardContent>
        <CardFooter>
          <Button class="w-full" type="submit"> Submit </Button>
        </CardFooter>
      </form>
    </Card>
  </main>
</template>
