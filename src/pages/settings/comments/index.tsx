import { Box, Grid, IconButton, Table, TableFooter, TablePagination, TableRow } from '@mui/material';
import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';

import { primaryLightColor, styleVariables } from '@/constants/styles-variables';
import { BookEntity, IPageable } from '@/lib/data/types';
import { useApproveComment, useRemoveComment, useBooksComments } from '@/lib/graphql/queries/book/hook';
import Loading from '@/components/loading';
import ErrorNotification from '@/components/error-notification';
import CustomModal from '@/components/modals/custom-modal';

const CommentStyledGrid = styled(Grid)(() => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: `1px solid ${primaryLightColor}`
}));

const StyledBookBox = styled(Box)(() => ({
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    borderBottom: `1px solid ${primaryLightColor}`,
    ':hover': {
        backgroundColor: primaryLightColor
    }
}));

export default function Comments() {
    const [pageSettings, setPageSettings] = useState<IPageable>({ page: 0, rowsPerPage: 10 });
    const { items, totalCount, loading, gettingError, refetch } = useBooksComments(pageSettings);
    const [selectedItem, setSelectedItem] = useState<BookEntity>();
    const { update: approveComment, updating: approving, updatingError: errorApproving } = useApproveComment();
    const { update: removeComment, updating: removing, updatingError: errorRemoving } = useRemoveComment();

    function onPageChange(val: number) {
        setPageSettings({
            ...pageSettings,
            page: val
        });
    }

    function onRowsPerPageChange(val: number) {
        setPageSettings({
            ...pageSettings,
            page: 0,
            rowsPerPage: val
        });
    }

    function onBookClick(item: BookEntity) {
        setSelectedItem(item);
    }

    function onApproveComment(bookId: string, commentId: string) {
        approveComment({ bookId, commentId }).then(({ comments }) => {
            if (comments.length === 0) {
                refetch();
                setSelectedItem(null);
            } else {
                selectedItem.comments = comments;
            }
        });
    }

    function onRemoveComment(bookId: string, commentId: string) {
        removeComment({ bookId, commentId }).then(({ comments }) => {
            if (comments.length === 0) {
                setSelectedItem(null);
                refetch();
            } else {
                selectedItem.comments = comments;
            }
        });
    }

    return (
        <Box sx={styleVariables.positionRelative}>
            <Loading show={loading}></Loading>

            {!!items?.length && items.map((item, index) => (
                <StyledBookBox key={index} onClick={() => onBookClick(item)} p={1}>
                    <Box sx={styleVariables.titleFontSize} mb={1}><b>{item.name}</b></Box>
                    <Box mb={1} sx={styleVariables.hintFontSize}>
                        {item.bookType.name} / {item.bookSeries.publishingHouse.name} / {item.bookSeries.name}
                    </Box>
                    <Box width="100%">Кількість коментарів для погодження: {item.comments.length}.</Box>
                </StyledBookBox>
            ))}

            {!!gettingError && <ErrorNotification error={gettingError}></ErrorNotification>}

            <Box sx={{ position: 'sticky', bottom: 0 }}>
                <Table>
                    <TableFooter>
                        <TableRow>
                            <TablePagination rowsPerPageOptions={[5, 10, 25]}
                                             count={totalCount}
                                             page={pageSettings.page}
                                             sx={styleVariables.paginatorStyles}
                                             labelRowsPerPage="Кількість на сторінці"
                                             rowsPerPage={pageSettings.rowsPerPage}
                                             onPageChange={(_e, val: number) => onPageChange(val)}
                                             onRowsPerPageChange={({ target }) => onRowsPerPageChange(Number(target.value))}/>
                        </TableRow>
                    </TableFooter>
                </Table>
            </Box>

            {!!selectedItem &&
              <CustomModal open={true}
                           onClose={() => setSelectedItem(null)}
                           title="Погодження коментарів"
                           loading={approving || removing}>
                  {selectedItem.comments.map((comment, index) => (
                      <CommentStyledGrid container key={index} py={1}>
                          <Grid item xs={9} display="flex" alignItems="center" flexWrap="wrap">
                              <Box mr={1}><b>{comment.username}</b></Box>
                              <Box sx={styleVariables.hintFontSize}>
                                  ({new Date(comment.date).toLocaleDateString()})
                              </Box>
                          </Grid>

                          <Grid item xs={3}>
                              <IconButton onClick={() => onRemoveComment(selectedItem.id, comment.id)} color="warning">
                                  <ThumbDownAltIcon/>
                              </IconButton>
                              <IconButton onClick={() => onApproveComment(selectedItem.id, comment.id)} color="primary">
                                  <ThumbUpAltIcon/>
                              </IconButton>
                          </Grid>

                          <Grid item xs={12} mt={1}>
                              {comment.value}
                          </Grid>
                      </CommentStyledGrid>
                  ))}
                  {errorApproving && <ErrorNotification error={errorApproving}></ErrorNotification>}
                  {errorRemoving && <ErrorNotification error={errorRemoving}></ErrorNotification>}
              </CustomModal>}
        </Box>
    );
}