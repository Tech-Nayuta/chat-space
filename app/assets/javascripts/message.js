$(function(){

  var reloadMessages = function() {

    //カスタムデータ属性を利用し、ブラウザに表示されている最新メッセージのidを取得
    var last_message_id = $('.message:last').data("message-id");
    
    $.ajax({
      //ルーティングで設定した通り/groups/id番号/api/messagesとなるよう文字列を書く
      url: "api/messages",
      //ルーティングで設定した通りhttpメソッドをgetに指定
      type: 'get',
      dataType: 'json',
      //dataオプションでリクエストに値を含める
      data: {id: last_message_id}
    })
    .done(function(messages) {
      if (messages.length !== 0) {
        //追加するHTMLの入れ物を作る
        var insertHTML = '';
        //配列messagesの中身一つ一つを取り出し、HTMLに変換したものを入れ物に足し合わせる
        $.each(messages, function(i, message) {
          insertHTML += buildHTML(message)
        });
        //メッセージが入ったHTMLに、入れ物ごと追加
        $('.chat-main__message-list').append(insertHTML);      
        $('.chat-main__message-list').animate({ scrollTop: $('.chat-main__message-list')[0].scrollHeight});
      }
    })
    .fail(function() {
      alert('error');
    });
  };

  function buildHTML(message) {

    if (message.image){

      var html = `<div class="message"  data-message-id="${message.id}">
      <div class="message__info">
      <div class="messenger">
      ${message.user_name}
      </div>
      <div class="time">
      ${message.created_at}
      </div>
      </div>`

      if(message.body){
        html += `<div class="message__text">${message.body}</div>`
      }

      html += `<img src=" ${message.image} " class="message__image" >
       </div>`
    }
    else{
      var html = `<div class="message" data-message-id="${message.id}">
       <div class="message__info">
      <div class="messenger">
      ${message.user_name}
      </div>
      <div class="time">
      ${message.created_at}
      </div>
      </div>`

      if(message.body){
        html +=  `<div class="message__text">
        ${message.body}`
      }
    }

    return html;
  }

  $('#new_message').on('submit', function(e){
    e.preventDefault();
    var url = $(this).attr('action');
    var formData = new FormData(this);

    $.ajax({
      url:  url,
      type: 'POST',
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false,
    })
    .done(function(message){
      var html = buildHTML(message);
      $('.chat-main__message-list').append(html);
      $('.btn__send').prop('disabled',false);
      $('form')[0].reset(); //フォームをリセットする
    })
    .fail(function(){
      alert('メッセージ送信に失敗しました');
      $('.btn__send').prop('disabled',false);
    })

    $('.chat-main__message-list').animate({ scrollTop: $('.chat-main__message-list')[0].scrollHeight});
  })

  if (document.location.href.match(/\/groups\/\d+\/messages/)) {
    setInterval(reloadMessages, 7000);
  }
})