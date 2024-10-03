//import useChat from './useChat';
import useOriginalChat from './useChat'


const useChat1 = (id: string, chatId?: string) => {
  const chat = useOriginalChat(id, chatId);
  const modelId = 'model1-id'; // 最初のモデルのID
  chat.setModelId(modelId);
  return chat;
};

const useChat2 = (id: string, chatId?: string) => {
  const chat = useOriginalChat(id, chatId);
  const modelId = 'model2-id'; // 2番目のモデルのID
  chat.setModelId(modelId);
  return chat;
};

export {useChat1,useChat2};