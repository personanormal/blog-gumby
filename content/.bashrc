#! /bin/bash

echo ""
echo "--- SSH AGENT SCRIPT START ---"
echo ""

# Note: ~/.ssh/environment should not be used, as it
#       already has a different purpose in SSH.

env=~/.ssh/agent.env

# Note: Don't bother checking SSH_AGENT_PID. It's not used
#       by SSH itself, and it might even be incorrect
#       for example, when using agent-forwarding over SSH).

add_key_from_keyfile(){
	KEYFILE="/.git/KEY"
	KEYPATH=$PWD$KEYFILE

	if [ -f $KEYPATH ]
		then
			echo "@ Key file found at $KEYPATH"
			echo ""
			KEYVAL=`cat $KEYPATH`
			echo $KEYVAL			
		else
			echo "No Key file found at $KEYPATH. Creating new"
			echo "Enter Key"
			READ KEYIN
			
			if [ -z $KEYIN ]
				then
					echo "@ No Key value read"
					echo ""
					echo "@ DONE"
				else
					echo $KEYIN > $KEYPATH
					add_key $KEYIN
			fi
	fi
}

add_key(){
	if [ -z $1 ]
		then	
			echo "@ No Key value read"
			echo ""
			echo "@ DONE"
		else
			ECHO "@ Key value is $1"
			ECHO ""
			ECHO "@ Adding Key"
			ECHO ""
			ssh-add ~/.ssh/$1
			ECHO ""
			ECHO "@ DONE"	
	fi
}

agent_is_running() {
    if [ "$SSH_AUTH_SOCK" ]; then
        # ssh-add returns:
        #   0 = agent running, has keys
        #   1 = agent running, no keys
        #   2 = agent not running
        ssh-add -l >/dev/null 2>&1 || [ $? -eq 1 ]
    else
        false
    fi
}

agent_has_keys() {
    ssh-add -l >/dev/null 2>&1
}

agent_load_env() {
    . "$env" >/dev/null
}

agent_start() {
    (umask 077; ssh-agent >"$env")
    . "$env" >/dev/null
}

if ! agent_is_running; then
    agent_load_env
fi

if ! agent_is_running; then
    agent_start
    add_key_from_keyfile
elif ! agent_has_keys; then
    add_key_from_keyfile
fi

unset env

echo ""
echo "--- SSH AGENT SCRIPT END ---"
echo ""