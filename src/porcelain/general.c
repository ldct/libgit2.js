#include <git2.h>
#include <stdio.h>

#include "libcore.h"

int stage(char* filename) {
  git_repository* repo;
  git_index* index;

  git_repository_open(&repo, ".");
  git_repository_index(&index, repo);
  git_index_add_bypath(index, filename);
  git_index_write(index);
  
  git_index_free(index);
  return 0;
}

int commit(char* message) {
  git_repository* repo;

  git_index *index;
  git_oid tree_oid;
  git_tree *tree;
  
  git_oid head_oid, commit_oid;
  git_commit* head_commit;
  git_signature *signature;
  int head_missing;

  git_repository_open(&repo, ".");
  git_repository_index(&index, repo);
  git_index_write_tree(&tree_oid, index);    
  git_tree_lookup(&tree, repo, &tree_oid);
  
  git_signature_new(&signature, "Li Xuanji", "xuanji@gmail.com", 1323847743, 60);
  
  head_missing = git_reference_name_to_id(&head_oid, repo, "HEAD");
  
  if (head_missing) {
    git_commit_create_v(
      &commit_oid,
      repo,
      "HEAD",
      signature,
      signature,
      NULL,
      message,
      tree,
      0);
  } else {
    git_commit_lookup(&head_commit, repo, &head_oid);
    git_commit_create_v(
      &commit_oid,
      repo,
      "HEAD",
      signature,
      signature,
      NULL,
      message,
      tree,
      1,
      head_commit); 
  }

  //git_index_clear(index);
  git_index_write(index);

  git_tree_free(tree);
  git_index_free(index);
  git_signature_free(signature);

  return 0;
}

int general() {
  git_repository* repo;
  git_repository_init(&repo, "hello-world-app", 0);
  cd("hello-world-app");

  touch("hello.py", "print 'hello world!'");
  stage("hello.py");
  commit("Initial commit");
  
  return 0;
}
