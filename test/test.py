import random

cards=[str(i) for i in range(2,11)]
cards.extend(list("JQKA"))

allcards=[]
for s in "abcd":
    for c in cards:
       allcards.append(c+' '+s)

random.shuffle(allcards)
print(len(allcards), allcards)