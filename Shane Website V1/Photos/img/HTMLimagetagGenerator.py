import os

filenames = os.listdir("/Users/shane/Desktop/Code/Shane Website 2020/personal-website/personal-website/Shane Website V1/Photos/img")
filenames.sort()
for name in filenames:
    if(name[0] != "." and name[-2:] != "py"):
        tags = " ".join(name.split("_")[:-1]);
        print(f'''<div class="{tags}"><div class="inner"><img src="img/{name}" alt=""></div></div>''')
