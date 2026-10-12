import json,subprocess,sys
S=json.load(open(sys.argv[1] if len(sys.argv)>1 else "sessions.json"))
def get(p):
    return json.loads(subprocess.run(["curl","-sS","https://jules.googleapis.com/v1alpha/"+p],capture_output=True,text=True).stdout or "{}")
for k,i in S.items():
    s=get(f"sessions/{i}")
    prs=[o.get("pullRequest",{}).get("url") for o in s.get("outputs",[]) if o.get("pullRequest")]
    acts=get(f"sessions/{i}/activities?pageSize=100").get("activities",[])
    kinds=[next((x for x in a if x.endswith(("Generated","Approved","Posted","Completed","Failed","Requested"))),"?") for a in acts]
    plan=any("planGenerated" in a for a in acts); appr=any("planApproved" in a for a in acts)
    last=[a for a in acts if "agentMessaged" in a or "userMessaged" in a]
    print(f"{k:13} {s.get('state','?'):28} plan={plan} approved={appr} pr={prs[0] if prs else '-'}")
