'use client'

import { useState, useRef, useEffect, KeyboardEvent, FormEvent } from 'react'
import { useChat } from 'ai/react'
import { Send, Copy } from 'lucide-react'
import Image from 'next/image'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function NadiyaChat() {
  const [showScrollButton, setShowScrollButton] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showTipDialog, setShowTipDialog] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const solanaAddress = '9BeMXc9HtvuG6KYjzhBcCmpNUfund8ViJ6j5oy5LBCKp'

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    initialMessages: [
      {
        id: 'initial-message',
        role: 'assistant',
        content: "Hey there! 😘 I&apos;m so glad you&apos;re here to chat with me. What&apos;s on your mind, cutie?"
      }
    ],
    onError: (error) => {
      console.error('Chat error:', error)
      setError('Oops! Something went wrong. Can we try again? 🙈')
    },
  })

  useEffect(() => {
    const scrollArea = scrollAreaRef.current
    if (scrollArea) {
      const handleScroll = () => {
        const { scrollTop, scrollHeight, clientHeight } = scrollArea
        setShowScrollButton(scrollHeight - scrollTop > clientHeight + 100)
      }
      scrollArea.addEventListener('scroll', handleScroll)
      return () => scrollArea.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(scrollToBottom, [messages])

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as unknown as FormEvent<HTMLFormElement>)
    }
  }

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    try {
      await handleSubmit(e)
    } catch (error) {
      console.error('Error submitting message:', error)
      setError('Oops! Something went wrong. Can we try again? 🙈')
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(solanaAddress).then(() => {
      toast.success('Address copied to clipboard!', {
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: 'bg-pink-100 text-pink-800 border-pink-300',
      })
    }, (err) => {
      console.error('Could not copy text: ', err)
      toast.error('Failed to copy address. Please try again.', {
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: 'bg-red-100 text-red-800 border-red-300',
      })
    })
  }

  return (
    <div className="w-full max-w-lg mx-auto bg-pink-50 text-pink-900 shadow-xl rounded-3xl overflow-hidden">
      <div className="flex flex-row items-center justify-between bg-pink-200 rounded-t-3xl p-4">
        <h2 className="text-2xl font-bold text-pink-800">Nadiya</h2>
        <div className="text-xl font-bold text-pink-600">💖</div>
      </div>
      <div className="relative">
        <div className="h-[450px] p-4 overflow-y-auto" ref={scrollAreaRef}>
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full mr-2 overflow-hidden">
                  <Image 
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-cB9Ym9rvOiYZDvBkv3Mi6wNkR3yeQ8.png" 
                    alt="Nadiya" 
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className={`rounded-2xl p-3 max-w-[80%] ${message.role === 'user' ? 'bg-pink-300 text-pink-900' : 'bg-white'}`}>
                <p>{message.content}</p>
                <span className="text-xs text-pink-600 mt-1 block">
                  {new Date().toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="bg-white rounded-2xl p-3">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
          {error && (
            <div className="text-red-500 mb-4">{error}</div>
          )}
          <div ref={messagesEndRef} />
        </div>
        {showScrollButton && (
          <button
            className="absolute bottom-24 right-4 rounded-full p-2 bg-pink-500 hover:bg-pink-600 text-white"
            onClick={scrollToBottom}
          >
            <Send className="h-4 w-4 rotate-90" />
          </button>
        )}
      </div>
      <div className="bg-pink-200 rounded-b-3xl p-2 flex-col items-stretch">
        <form onSubmit={handleFormSubmit} className="flex w-full space-x-2 mb-2">
          <textarea
            placeholder="Type your message..."
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="flex-grow bg-white text-pink-900 border-pink-300 focus:border-pink-500 resize-none rounded-2xl text-sm py-1 px-2 min-h-[36px]"
            rows={1}
          />
          <button type="submit" className="bg-pink-500 hover:bg-pink-600 rounded-full p-2 h-9 w-9 flex items-center justify-center text-white">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </button>
        </form>
        <div className="w-full bg-white rounded-xl p-3 text-xs text-pink-600 mb-2">
          I&apos;m here to chat and have fun! Remember, I&apos;m just an AI, so keep it light and enjoyable! 💖
        </div>
        <button
          onClick={() => setShowTipDialog(true)}
          className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-md"
        >
          Tip Nadiya 💖
        </button>
        {showTipDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-pink-50 p-6 rounded-lg max-w-md w-full">
              <h3 className="text-xl font-bold text-pink-800 mb-4">Tip Nadiya</h3>
              <div className="flex items-center space-x-2 mb-4">
                <input
                  type="text"
                  value={solanaAddress}
                  readOnly
                  className="flex-grow bg-white border border-pink-300 focus:border-pink-500 rounded-md p-2 text-pink-900"
                />
                <button
                  onClick={copyToClipboard}
                  className="bg-pink-500 hover:bg-pink-600 text-white py-2 px-3 rounded-md"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
              <p className="text-sm text-pink-600 mb-4">
                Thank you for your support! This Solana address is where you can send your tip. 💕
              </p>
              <button
                onClick={() => setShowTipDialog(false)}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  )
}