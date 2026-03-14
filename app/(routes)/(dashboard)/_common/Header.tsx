"use client";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { LogOutIcon, MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import React from 'react'

const Header = () => {
  const { theme, setTheme } = useTheme()
  const isDark = theme === "dark";
  return <div className='border-b border-border bg-background'>
    
      <div className='w-full px-6 lg:px-0 mx-auto max-w-6xl h-11 flex items-center justify-between'>
        <div></div>

        <div className='flex items-center gap-4'>
          <Button
          variant="outline"
          size="icon"
          className='relative rounded-full size-8'
          onClick={() => setTheme(isDark ? "light": "dark")}
          >
            <SunIcon 
            className={cn(
              "absolute h-5 w-5",
              isDark ? "scale-100" : "scale-0"
            )}
            />
            <MoonIcon 
              className={cn(
              "absolute h-5 w-5",
              isDark ? "scale-0" : "scale-100"
            )}
            />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className='size-8 shrink-0 rounded-full'>
                <AvatarImage src="" />
                <AvatarFallback className='rounded-full'>
                  TE
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-56'>
              <DropdownMenuItem>
                <LogOutIcon className='h-4 w-4' />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
}

export default Header