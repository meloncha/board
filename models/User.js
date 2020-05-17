// models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
// require 함수로 bcryptjs package를 bcrypt 변수에 담았습니다

// schema // 1
const userSchema = mongoose.Schema({
  username:{type:String, required:[true,'Username is required!'], unique:true},
  password:{type:String, required:[true,'Password is required!'], select:false},
  name:{type:String, required:[true,'Name is required!']},
  email:{type:String}
},{
  toObject:{virtuals:true}
});

// virtuals // 2
userSchema.virtual('passwordConfirmation')
  .get(function(){ return this._passwordConfirmation; })
  .set(function(value){ this._passwordConfirmation=value; });

userSchema.virtual('originalPassword')
  .get(function(){ return this._originalPassword; })
  .set(function(value){ this._originalPassword=value; });

userSchema.virtual('currentPassword')
  .get(function(){ return this._currentPassword; })
  .set(function(value){ this._currentPassword=value; });

userSchema.virtual('newPassword')
	.get(function(){ return this._newPassword; })
	.set(function(value){ this._newPassword=value; });

// password validation // 3
userSchema.path('password').validate(function(v) {
  var user = this; // 3-1

  // create user // 3-3
  if(user.isNew){ // 3-2
    if(!user.passwordConfirmation){
      user.invalidate('passwordConfirmation', 'Password Confirmation is required.');
    }

    if(user.password !== user.passwordConfirmation) {
      user.invalidate('passwordConfirmation', 'Password Confirmation does not matched!');
    }
  }

  // update user // 3-4
  if(!user.isNew){
    if(!user.currentPassword){
      user.invalidate('currentPassword', 'Current Password is required!');
    }
    else if(!bcrypt.compareSync(user.currentPassword, user._originalPassword)){
			// bcrypt.compareSync(user.currentPassword, user.originalPassword)에서 
			// user.currentPassword는 입력받은 text값. user.originalPassword는 user의 password hash값.
			// hash를 해독해서 text를 비교하는 것이 아니라 text값을 hash로 만들고 그 값이 일치하는지를
			// 확인하는 과정이다.
      user.invalidate('currentPassword', 'Current Password is invalid!');
    }

    if(user.newPassword !== user.passwordConfirmation) {
      user.invalidate('passwordConfirmation', 'Password Confirmation does not matched!');
    }
  }
});

// hash password
userSchema.pre('save', next => {
	let user = this;
	if (!user.isModified('password')) {
		return next();
	}
	else {
		user.password = bcrypt.hashSync(user.password);
		return next();
	}
});
/*
	Schema.pre 함수는 첫번째 파라미터로 설정된 event가 일어나기 전(pre)에 먼저 callback함수를 실행
	'save' event는 Model.create, model.save 함수 실행시 발생하는 event입니다
	user를 생성하거나 user를 수정한 뒤 save 함수를 실행할 때 위의 callback 함수가 먼저 호출된다
	
	isModified 함수는 해당 값이 db에 기록된 값고 비교해서 변경된 경우 true를 그렇지 않은 경우 false를 반환하는 함수
	user생성시는 항상 true이며, user 수정시는 password가  변경되는 경우에만 true를 반환합니다.
	user.password의 변경이 없는 경우라면 이미 해당위치에 hash가 저장되어 있으므로 다시 hash를 만들지 않습니다

	user를 생성하거나 user 수정시 user.password의 변경이 있는 경우에는 
	bcrypt.hashSync 함수로 password를 hash값으로 바꿉니다
*/

// model methods
userSchema.methods.authenticate = password => {
	let user = this;
	return bcrypt.compareSync(password, user.password);
};
// user model의 passwor hash 와 입력받은 password text를 비교하는 method를 추가합니다.
// 로그인을 만들게 될 method이며 bcrypt를 사용한다

// model & export
var User = mongoose.model('user',userSchema);
module.exports = User;