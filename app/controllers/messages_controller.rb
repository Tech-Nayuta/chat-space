class MessagesController < ApplicationController
  before_action :set_group

  def index 
    @message = Message.new
    @messages = @group.messages.includes(:user)
  end

  def create 
    @message = @group.messages.new(message_params)
    if @message.save
      # redirect_to group_messages_path(), notice: 'メッセージを送信しました'
    else
      flash.now[:alart] = 'メッセージを入力してください。'
      render :index
    end

    respond_to do |format|
      format.html{ redirect_to group_messages_path(), notice: 'メッセージを送信しました'}
      format.json
    end
  end

  private
  def message_params
    # binding.pry
    params.require(:message).permit(:body, :image).merge(user_id: current_user.id)
  end

  def set_group
    @group = Group.find(params[:group_id])
  end
end
