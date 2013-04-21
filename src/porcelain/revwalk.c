#include <git2.h>
#include <stdio.h>

int revwalk_from_head(git_repository* repo) {
  git_revwalk *walk;
  git_commit *w_commit;
  git_oid w_oid;
  
  char w_oid_str[41];
  w_oid_str[40] = '\0';

  char p_oid_str[41];
  p_oid_str[40] = '\0';

  git_revwalk_new(&walk, repo);
  git_revwalk_sorting(walk, GIT_SORT_TOPOLOGICAL);
  
  git_revwalk_push_head(walk);
  while ((git_revwalk_next(&w_oid, walk)) == 0) {
    git_oid_fmt(w_oid_str, &w_oid);
    git_commit_lookup(&w_commit, repo, &w_oid);
    int parent_count = git_commit_parentcount(w_commit);
    printf("%s", w_oid_str);
    printf("%i ", parent_count);
    for (int i = 0; i < parent_count; i++) {
      git_oid_fmt(p_oid_str, git_commit_parent_id(w_commit, i));
      printf("%s ", p_oid_str);
    }
    printf("%s", git_commit_message(w_commit));
    printf("%s", w_oid_str);
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