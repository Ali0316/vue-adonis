<script setup lang="js">
import {ref} from 'vue';
import axios from 'axios'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import {useRouter} from 'vue-router';

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

const router = useRouter()
const formSchema = toTypedSchema(z.object({
fullName: z.string({message:"Full Name should not be empty"}).min(3,{message: "Full Name should be at least 3 characters"}).max(50, {message: "Full Name should be at most 50 characters"}),
email: z.string({message:"Email should not be empty"}).email({message: 'Invalid email address'}),
password: z.string({message:"Password should not be empty"}).min(6,{message: "Password should be at least 6 characters"}).max(50, {message: "Password should be at most 50 characters"}),
password_confirmation: z.string().refine((value) => value === form.values.password, {message: "Passwords do not match"}),
}))

const form = useForm({
  validationSchema: formSchema,
})

let errors = ref('');
const onSubmit = form.handleSubmit(async (values) => {
  try {
    errors.value = ''
    let res = await axios.post("http://localhost:3333/api/auth/register",values);

    if(res.error){
      throw Error(res);
    }

    router.push('/');

  } catch (error){
    errors.value = error;
  }
})
</script>

<template>
  <main class="w-full h-screen flex flex-col justify-center items-center">
    <Card class="w-full max-w-sm">
      <CardHeader>
        <CardTitle class="text-2xl"> Signup </CardTitle>
        <CardDescription>
          {{ errors }}
          Enter your details below to create an account.
        </CardDescription>
      </CardHeader>
      <form @submit="onSubmit">
        <CardContent class="grid gap-4">
          <FormField
            v-slot="{ componentField }"
            class="grid gap-2"
            name="fullName"
          >
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="John Doe"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
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
            v-slot="{ componentField }"
            class="grid gap-2"
            name="password_confirmation"
          >
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
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
        </CardContent>
        <CardFooter>
          <Button class="w-full" type="submit"> Submit </Button>
        </CardFooter>
      </form>
    </Card>
  </main>
</template>
