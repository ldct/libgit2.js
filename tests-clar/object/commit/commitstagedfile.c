	char buffer[128];
	cl_git_pass(git_oid_fromstr(&expected_commit_oid, "1fe3126578fc4eca68c193e4a3a0a14a0704624d"));

	cl_git_pass(git_message_prettify(buffer, 128, "Initial commit", 0));

		buffer,