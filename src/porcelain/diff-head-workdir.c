#include <git2.h>
#include <stdio.h>

int diff_print_cb_hw(
  const git_diff_delta *delta,
  const git_diff_range *range,
  char line_origin,
  const char *content,
  size_t content_len,
  void *payload)
{
  printf("%s", content);
  return 0;
}

//implements http://libgit2.github.com/libgit2/#HEAD/group/diff/git_diff_tree_to_workdir
//git diff HEAD (almost)
int diff_head_workdir(git_repository* repo) {
  git_diff_list* diff;

  git_reference* ref_head;
  git_commit* head;
  git_tree* head_tree;

  git_repository_head(&ref_head, repo);
  git_reference_peel((git_object**) &head, ref_head, GIT_OBJ_COMMIT);
  git_commit_tree(&head_tree, head);
  git_diff_tree_to_workdir(&diff, repo, head_tree, NULL);

  git_diff_print_patch(diff, diff_print_cb_hw, NULL);

  return 0;
}

int diff_head_workdir_str(char* ref_name) {
  git_repository* repo;
  git_repository_open(&repo, ref_name);
  return diff_head_workdir(repo);
}
