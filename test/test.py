import re
 
str1='123  456  7\t8\r9\n10'
str1 = re.sub('[\s+]', '', str1)
print(str1)