#include <git2.h>
#include <stdio.h>
#include <string.h>

int ref_callback(const char * ref_name, void* payload) {
  if (strncmp(ref_name, "refs/heads/", 11) == 0) {
    git_revwalk_push_ref((git_revwalk*) payload, ref_name);
  }
  return 0;
}

void walk_and_print(git_revwalk* walk, git_repository* repo) {
  git_oid w_oid;
  git_commit* w_commit;

  char w_oid_str[41];
  w_oid_str[40] = '\0';

  char p_oid_str[41];
  p_oid_str[40] = '\0';

  while ((git_revwalk_next(&w_oid, walk)) == 0) {
    git_oid_fmt(w_oid_str, &w_oid);
    git_commit_lookup(&w_commit, repo, &w_oid);
    int parent_count = git_commit_parentcount(w_commit);
    printf("%s %i ", w_oid_str, parent_count);
    for (int i = 0; i < parent_count; i++) {
      git_oid_fmt(p_oid_str, git_commit_parent_id(w_commit, i));
      printf("%s ", p_oid_str);
    }
    const char* msg = git_commit_message(w_commit);
    for (int i = 0; msg[i] != 0; i++) {
      printf("%02x", (unsigned char)msg[i]);
    }
    printf("\n");
    git_commit_free(w_commit);
  }

}

int revwalk_from_sha(char const * repo_name, char const * sha) {
  git_repository* repo;
  git_repository_open(&repo, repo_name);

  git_oid sha_oid;
  git_oid_fromstr(&sha_oid, sha);

  git_commit* sha_commit;
  git_commit_lookup_prefix(&sha_commit, repo, &sha_oid, strlen(sha));

  char out[41];
  out[40] = '\0';

  git_revwalk* walk;
  git_revwalk_new(&walk, repo);
  git_revwalk_sorting(walk, GIT_SORT_TOPOLOGICAL);

  git_oid_fmt(out, git_commit_id(sha_commit));
  fprintf(stderr, "STDERR: pushing a commit %s\n", out);
  git_revwalk_push(walk, git_commit_id(sha_commit));

  walk_and_print(walk, repo);
  git_revwalk_free(walk);

  return 0;
}

int revwalk_all(char const * repo_name) {
  git_repository* repo;
  git_repository_open(&repo, repo_name);

  git_revwalk* walk;

  git_revwalk_new(&walk, repo);
  git_revwalk_sorting(walk, GIT_SORT_TOPOLOGICAL);
  
  git_reference_foreach(repo, &ref_callback, walk);
  git_revwalk_push_head(walk);

  walk_and_print(walk, repo);
  git_revwalk_free(walk);

  return 0;
}

/*
int main(int argc, char** argv) {  
  if (argc < 2) {
    return revwalk_all_str(".");
  } else {
    return revwalk_all_str(argv[1]);
  }
}
*/
