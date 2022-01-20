import random


userID = '20184281'

path = '..\\temp_program\\' + userID + '\\'
with open(path + str(random.randint(0, 10000)) + '.py', 'w', encoding='utf-8' ) as file:
    file.write('xixi')