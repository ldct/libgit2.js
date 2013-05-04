#include <git2.h>

int branch(char* branch_name) {
  git_reference* out;
  git_repository* repo;
  git_oid head_oid;
  git_commit* head_commit;

  git_repository_open(&repo, ".");

  git_reference_name_to_id(&head_oid, repo, "HEAD");
  git_commit_lookup(&head_commit, repo, &head_oid);

  return git_branch_create(&out, repo, branch_name, head_commit, 1);
}

int set_HEAD_to_ref(char* ref_name) {
  git_repository* repo;
  git_repository_open(&repo, ".");

  return git_repository_set_head(repo, ref_name);
}