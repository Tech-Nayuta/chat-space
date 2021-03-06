class UsersController < ApplicationController
 
  def index
    return nil if params[:keyword] == ""
    @users = User.where(['name LIKE ?', "%#{params[:keyword]}%"] ).where.not(id: current_user.id).limit(10)
    respond_to do |format|
      format.html
      format.json
    end
  end
 
  def edit
  end

  def update
    user = User.find(params[:id])
    if user.update(user_params) #データベースで引っかかる場合（name, email が一意性制約に反する場合）falseになる
      redirect_to root_path
    else          
      render :edit 
    end
  end

  private
  def user_params
    params.require(:user).permit(:name,:email)
  end
end
