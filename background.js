(() => {

    // chrome.runtime.onInstalled.addListener(()=>{
    //   chrome.contextMenus.create({
    //     id: "openInTest",
    //     title: "Open in test",
    //     contexts: ['all'],
    //   });
    // });

    chrome.runtime.onInstalled.addListener(()=>{
      chrome.contextMenus.create({
        id: 'captureMenuItem',
        title: 'Capture Network Element',
        contexts: ['all'] // Show the option in all context menus
      });
    });
      
    
    const socket = new WebSocket('ws://localhost:8082/websocket');


    function connectWebSocket(){

      socket.addEventListener('open', (event) => {
        console.log('WebSocket connection established.');


        // heartbeat message every 2mns
        setInterval(() =>{
          socket.send('heartbeat');
        },120000);
        
      });
      
      socket.addEventListener('message', (event) => {
        const receivedMessage = event.data;
        console.log('Received message:', receivedMessage);

        if (receivedMessage.startsWith('path')){
          const path = receivedMessage.substring(5);
          console.log('Path to send: ',path);
          socket.send(receivedMessage);
        }
      });
      
      socket.addEventListener('close', (event) => {
        console.log('WebSocket connection closed.');

        
      });
    }    
    
    
    
    

    // chrome.contextMenus.onClicked.addListener((info, tab) =>{
    //   if (info.menuItemId == 'openInTest'){
    //     const url = info.srcUrl || info.linkUrl || info.pageUrl;
    //     if (url){
    //       console.log(url);
    //       if (socket.readyState === WebSocket.OPEN){
    //         socket.send(url);
    //       }
    //       else{
    //         console.log("WebSocket not connected. Please wait or reload the extension");
    //       }
    //     }
    //   }
    // });
    
    // Extension reload on page reload
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        if (changeInfo.status === 'complete') {
          console.log('Page URL:', tab.url);
          console.log('Reloading extension');
          chrome.runtime.reload();
        }
      });


    


    


    
    connectWebSocket();
    
    

})();