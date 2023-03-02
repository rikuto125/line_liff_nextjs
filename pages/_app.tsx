import React, { useEffect, useState } from 'react'
import Head from 'next/head'

import '../styles/globals.css'
import { AppProps } from 'next/app'

const App = ({ Component, pageProps }: AppProps) => {
    const [liffObject, setLiffObject] = useState<any>(null)
    const [profileName, setProfileName] = useState<string>('')
    const [count, setCount] = useState<string>('')
    const [chapter, setChapter] = useState<string>('')
    const [section, setSection] = useState<string>('')
    const [error, setError] = useState<string>('')
    const [completeMessage, setCompleteMessage] = useState<string>('')

    useEffect(() => {
        import('@line/liff').then((liff: any) => {
            liff
                .init({
                    liffId: process.env.NEXT_PUBLIC_LIFF_ID,
                })
                .then(() => {
                    if (!liff.isLoggedIn()) {
                        liff.login({})
                    }
                    setLiffObject(liff)
                    liff
                        .getProfile()
                        .then((profile: any) => {
                            setProfileName(profile.displayName)
                        })
                        .catch((err: any) => {
                            console.error({ err })
                        })
                })
                .catch((err: any) => {
                    console.error({ err })
                })
        })
    }, [])

    const handleSendMessage = () => {
        if (liffObject) {
            if (!chapter || !section || !count) {
                setError('ChapterとSectionとCountは必須です。')
                return
            }

            if (chapter && !/^\d+$/.test(chapter)) {
                    setError('Chapterは半角数字で入力してください。')
                    return
            }

            if (section && !/^\d+$/.test(section)) {
                setError('Sectionは半角数字で入力してください。')
                return
            }

            if (count && !/^\d+$/.test(count)) {
                setError('Countは半角数字で入力してください。')
                return
            }
            const messageToSend = `${chapter}-${section}-${count}`
            liffObject.sendMessages([
                {
                    type: 'text',
                    text: messageToSend,
                },
            ])

            setCompleteMessage('送信しました。')
        }
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target
        setError('')
        switch (name) {
            case 'chapter':
                setChapter(value)
                break
            case 'section':
                setSection(value)
                break
            case 'count':
                setCount(value)
                break
            default:
                break
        }
    }

    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
            </Head>
            <div>
                <div>Profile Name: {profileName}</div>
                <div style={{ color: 'red' }}>{error}</div>
                <div>*半角数字で入力してください</div>
                <div>
                    <h3>Chapter</h3>
                    <input type="text" name="chapter" value={chapter} onChange={handleInputChange} />
                </div>
                <div>
                    <h3>Section</h3>
                    <input type="text" name="section" value={section} onChange={handleInputChange} />
                </div>
                <div>
                    <h3>Count</h3>
                    <input type="text" name="count" value={count} onChange={handleInputChange} />
                </div>
                <div>
                    <button onClick={handleSendMessage}>Send Message</button>
                </div>

                <div style={{ color: 'green' }}>{completeMessage}</div>
            </div>
        </>
    )
}

export default App
