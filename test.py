import hashlib  # md5 加密

pwd = '123456'
pwd_md5 = hashlib.md5()

pwd_md5.update(pwd.encode('utf-8'))

pro_pwd = pwd_md5.hexdigest()
print(type(pro_pwd), pro_pwd)