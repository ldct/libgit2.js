#include <git2.h>
#include <stdio.h>

int revwalk_from_head(git_repository* repo) {
  git_revwalk *walk;
  git_commit *w_commit;
  git_oid w_oid;
  
  char out[41];
  out[40] = '\0';

  git_revwalk_new(&walk, repo);
  git_revwalk_sorting(walk, GIT_SORT_TOPOLOGICAL);
  
  git_revwalk_push_head(walk);
  while ((git_revwalk_next(&w_oid, walk)) == 0) {
    git_oid_fmt(out, &w_oid);
    git_commit_lookup(&w_commit, repo, &w_oid);
    printf("%s%s%s", out, git_commit_message(w_commit), out);
    git_commit_free(w_commit);
  }
  git_revwalk_free(walk);
  printf("\n");

  return 0;
}

int revwalk_from_head_str(char* s) {
  git_repository* repo;
  git_repository_open(&repo, s);
  return revwalk_from_head(repo);
}

/*
int main(int argc, char** argv) {  
  if (argc < 2) {
    return revwalk_from_head_str(".");
  } else {
    return revwalk_from_head_str(argv[1]);
  }
}
*/