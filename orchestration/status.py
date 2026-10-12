import json,subprocess,time
S={k:v for k,v in json.load(open('sessions.json')).items() if not k.endswith('_old')}
def G(p):
    for _ in range(4):
        o=subprocess.run(["curl","-sS","https://jules.googleapis.com/v1alpha/"+p],capture_output=True,text=True).stdout
        try: return json.loads(o)
        except Exception: time.sleep(3)
    return {}
for k,i in S.items():
    s=G(f"sessions/{i}"); acts=sorted(G(f"sessions/{i}/activities?pageSize=100").get('activities',[]),key=lambda a:a['createTime'])
    if not s or not acts: print(k,'api-error'); continue
    prs=[o['pullRequest']['url'].rsplit('/',1)[1] for o in s.get('outputs',[]) if 'pullRequest' in o]
    plans=[a['planGenerated']['plan']['id'] for a in acts if 'planGenerated' in a]; ap=[a['planApproved']['planId'] for a in acts if 'planApproved' in a]
    pend=bool(plans) and plans[-1] not in ap
    lk=acts[-1]; kind=[x for x in lk if x not in('name','id','createTime','originator')][0]
    msg=lk[kind]['agentMessage'][:200].replace('\n',' ') if kind=='agentMessaged' else ''
    print(f"{k:13}{s['state']:12}pend={pend!s:5}PR#={prs[0] if prs else '-':3} last={kind}@{lk['createTime'][11:16]} {msg}")
