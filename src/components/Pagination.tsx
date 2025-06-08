import Button from './Button';

interface PaginationProps {
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  currentPage: number;
  totalPages: number;
  from: number;
  totalResults: number;
}

export default function Pagination({
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  currentPage,
  totalPages,
  from,
  totalResults
}: PaginationProps) {
  return (
    <div style={{ marginTop: '16px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center',
        gap: '1px',
        margin: '30px 0'
      }}>
        <Button 
          onClick={onPrev} 
          disabled={!hasPrev}
          className="pagination-button"
          style={{ 
            borderRadius: '18px 0 0 18px',
            margin: '0',
            marginLeft: '10px'
          }}
        >
          Previous
        </Button>
        <Button 
          onClick={onNext} 
          disabled={!hasNext || from + 25 >= totalResults}
          className="pagination-button"
          style={{ 
            borderRadius: '0 18px 18px 0',
            margin: '0',
            marginLeft: '10px'
          }}
        >
          Next
        </Button>
      </div>
      <div style={{ 
        textAlign: 'right',
        padding: '0 60px',
        color: '#666',
        fontSize: '14px',
        marginTop: '-20px'
      }}>
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
} 