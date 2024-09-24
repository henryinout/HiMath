import json
#我忘了怎么做了你先等一下我想一下好怎么调来着你先别急我想一下我想想没事我记得有一个open是那么什么先别急啊你先，没听清jason哦我这这个是欸我不不不哦哦，毁了。就是 就是
with open('SomeName.json', "r") as SN:
    data = json.load(SN)
    print(data["b"][1])