# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20120903141135) do

  create_table "characters", :force => true do |t|
    t.integer  "user_id"
    t.text     "data"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "l_histories", :force => true do |t|
    t.text     "history"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "l_requests", :force => true do |t|
    t.integer  "map"
    t.integer  "user"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "lobbies", :force => true do |t|
    t.integer  "map"
    t.integer  "user"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "maps", :force => true do |t|
    t.text     "mapdata"
    t.text     "characterdata"
    t.integer  "story_id"
    t.text     "story_data"
    t.text     "itemdata"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.text     "history"
    t.integer  "character"
    t.string   "title"
    t.string   "summary"
    t.string   "drama"
  end

  create_table "stories", :force => true do |t|
    t.integer  "user_id"
    t.text     "data"
    t.integer  "character"
    t.integer  "completed"
    t.string   "stub"
    t.integer  "vote"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.text     "history"
    t.string   "currentuser"
    t.integer  "published"
    t.string   "started"
    t.string   "title"
    t.string   "summary"
  end

  create_table "useronlines", :force => true do |t|
    t.integer  "uid"
    t.integer  "sid"
    t.integer  "socketid"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "users", :force => true do |t|
    t.string   "email"
    t.string   "encrypted_password",     :limit => 128, :default => "", :null => false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",                         :default => 0
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.string   "uname"
    t.string   "facebook_id"
    t.integer  "rating"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "firstname"
    t.string   "lastname"
    t.string   "image"
  end

  add_index "users", ["email"], :name => "index_users_on_email", :unique => true
  add_index "users", ["reset_password_token"], :name => "index_users_on_reset_password_token", :unique => true

end
