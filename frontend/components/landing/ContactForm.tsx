'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { portfolioApi } from '@/lib/api'

export function ContactForm() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [responseMessage, setResponseMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')

    try {
      const response = await portfolioApi.submitContact(formData)
      setStatus('success')
      setResponseMessage(response.message)
      setFormData({ name: '', email: '', company: '', message: '' })
    } catch {
      setStatus('error')
      setResponseMessage('Backend not connected. Start it with: uvicorn app.main:app --reload')
    }
  }

  return (
    <section className="py-24 px-6" ref={ref}>
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/10 border-2 border-black/20 text-black/70 text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-hot-pink animate-pulse" />
            Backend Form Handler
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-black mb-4">
            reach out
            <br />
            <span className="text-hot-pink">directly</span>
          </h2>
          <p className="text-black/60">
            This form posts to the FastAPI backend. Try it out!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {status === 'success' ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-vibrant-green/20 border-2 border-vibrant-green rounded-3xl p-8 text-center"
            >
              <CheckCircle className="w-16 h-16 text-vibrant-green mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-black mb-2">Message Sent!</h3>
              <p className="text-black/70">{responseMessage}</p>
              <button
                onClick={() => setStatus('idle')}
                className="mt-6 px-6 py-2 bg-black text-white rounded-full hover:bg-hot-pink transition-colors"
              >
                Send Another
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-black mb-2">Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-black/20 focus:border-hot-pink focus:outline-none transition-colors bg-white"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-black mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-black/20 focus:border-hot-pink focus:outline-none transition-colors bg-white"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-2">Company</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-black/20 focus:border-hot-pink focus:outline-none transition-colors bg-white"
                  placeholder="Volume7 (hopefully!)"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-2">Message *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-black/20 focus:border-hot-pink focus:outline-none transition-colors bg-white resize-none"
                  placeholder="Tell me about the role, or just say hi!"
                />
              </div>

              {status === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-red-500 bg-red-50 px-4 py-3 rounded-xl"
                >
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-sm">{responseMessage}</span>
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-4 bg-black text-sunny-yellow font-bold text-lg rounded-full hover:bg-hot-pink hover:text-white transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending to API...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </motion.button>
            </form>
          )}
        </motion.div>

        {/* API info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <code className="text-xs bg-black/10 px-3 py-1 rounded-full text-black/50">
            POST /api/portfolio/contact
          </code>
        </motion.div>
      </div>
    </section>
  )
}
