"use client";
import { logOut } from '@/actions/auth.actions';
import { Button } from '@/components/ui/button';
import React from 'react'

const LogOutButton = ( { isButton }: {isButton : boolean}) => {
    const handleLogout = async () => {
        await logOut()
    }
  return (
    isButton ? <Button onClick={handleLogout}>Logout</Button> : <span onClick={handleLogout}>Logout</span>
  )
}

export default LogOutButton
