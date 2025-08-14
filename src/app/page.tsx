'use client'

import { useState, useRef, useEffect } from 'react'
import { Loader2, Bot, User } from 'lucide-react'

export default function Home() {
  const [userInput, setUserInput] = useState('')
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; message: string }[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading])

  const sendMessage = async () => {
    if (!userInput.trim()) return

    try {
      setMessages(prev => [...prev, { role: 'user', message: userInput }])
      setIsLoading(true)

      const res = await fetch('http://localhost:5270/api/Chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userInput,
        }),
      })

      const data = await res.json()
      console.log('API response:', data)

      setMessages(prev => [...prev, { role: 'ai', message: data.response }])
      setUserInput('')
    } catch (error) {
      console.error('API hatası:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black text-white flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6 text-purple-400">ChatBot</h1>

      <div
        ref={scrollRef}
        className="w-full max-w-2xl bg-gray-800 p-4 rounded-lg shadow-lg h-[450px] overflow-y-auto space-y-4"
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start gap-2 ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.role === 'ai' && (
              <div className="flex-shrink-0">
                <Bot className="w-5 h-5 text-green-400 mt-1" />
              </div>
            )}

            <div
              className={`p-3 max-w-[75%] rounded-xl text-sm whitespace-pre-wrap shadow-md ${
                msg.role === 'user'
                  ? 'bg-purple-600 text-white rounded-br-none'
                  : 'bg-gradient-to-r from-teal-700 to-emerald-600 text-white rounded-bl-none'
              }`}
            >
              <div className="text-xs opacity-70 mb-1">
                {msg.role === 'user' ? 'Siz' : 'Asistan'}
              </div>
              <div>{msg.message}</div>
            </div>

            {msg.role === 'user' && (
              <div className="flex-shrink-0">
                <User className="w-5 h-5 text-purple-300 mt-1" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-gray-400 mt-2">
            <Loader2 className="animate-spin w-4 h-4" />
            <span>Asistan yazıyor...</span>
          </div>
        )}
      </div>

      <div className="w-full max-w-2xl flex mt-4">
        <input
          type="text"
          className="flex-1 p-3 rounded-l-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
          placeholder="Bir mesaj yazın..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-purple-600 px-5 py-3 rounded-r-md hover:bg-purple-700 transition"
        >
          Gönder
        </button>
      </div>
    </main>
  )
}