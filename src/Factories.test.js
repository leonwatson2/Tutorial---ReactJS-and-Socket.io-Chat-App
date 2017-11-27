import {
	createMessage,
	createChat,
	createUser,
	createChatNameFromUsers
} from './Factories'

describe('How to create chats', ()=>{
  describe('Empty Chats', ()=>{
    it('should create an empty chat object with name Empty Chat', ()=>{
      const newChat = createChat()
      expect(newChat).toMatchObject({ 
        name: "Empty Chat",
        messages: [],
        users: [],
        id: expect.any(String),
        typingUsers: [],
        isCommunity: false
      })
    })
    
    it('should create a chat with an empty array of users', ()=>{
      const newChat = createChat()    
      expect(newChat).toMatchObject({ 
        users: [],
      })
    })
    
    it('should create a chat with an empty array of messages', ()=>{
      const newChat = createChat()    
      expect(newChat).toMatchObject({ 
        messages: [],
      })
    })
    
    it('should create a chat with that is not a community', ()=>{
      const newChat = createChat()    
      expect(newChat).toMatchObject({ 
        isCommunity: false,
      })
    })
  })

  it('should create a chat with name of users', ()=>{
    const newChat = createChat({users:["Mike", "Annie"]})
    expect(newChat).toMatchObject({ 
      name: "Mike & Annie",
      messages: [],
      users: ["Mike", "Annie"],
      id: expect.any(String),
      typingUsers: [],
      isCommunity: false
    })
  })

  it('should create a community chat with the community name', ()=>{
    const communityChat = createChat({ isCommunity:true, users: ["Mike", "Annie"] })
    expect(communityChat).toMatchObject({ 
      name: "Community",
      users: ["Mike", "Annie"],
      isCommunity: true
    })
  })

  

})
